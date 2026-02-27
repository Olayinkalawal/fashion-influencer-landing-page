"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface ProfilePayload {
  id: string;
  email: string;
  name: string | null;
  org_name: string | null;
  setting_type: string | null;
  joined_at: string | null;
}

export function ProfileDetailsForm() {
  const [profile, setProfile] = useState<ProfilePayload | null>(null);
  const [name, setName] = useState("");
  const [orgName, setOrgName] = useState("");
  const [settingType, setSettingType] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadProfile() {
      const response = await fetch("/api/portal/profile");
      const body = (await response.json()) as {
        profile?: ProfilePayload;
        message?: string;
      };
      if (!response.ok || !body.profile) {
        throw new Error(body.message ?? "Unable to load profile");
      }

      setProfile(body.profile);
      setName(body.profile.name ?? "");
      setOrgName(body.profile.org_name ?? "");
      setSettingType(body.profile.setting_type ?? "");
    }

    loadProfile().catch((loadError) =>
      setError(loadError instanceof Error ? loadError.message : "Unable to load profile"),
    );
  }, []);

  async function saveProfile() {
    setError(null);
    setMessage(null);
    setIsSaving(true);
    try {
      const response = await fetch("/api/portal/profile", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          org_name: orgName,
          setting_type: settingType,
        }),
      });

      const body = (await response.json()) as {
        profile?: ProfilePayload;
        message?: string;
      };

      if (!response.ok || !body.profile) {
        throw new Error(body.message ?? "Unable to save profile");
      }

      setProfile(body.profile);
      setMessage("Profile updated successfully.");
    } catch (saveError) {
      setError(saveError instanceof Error ? saveError.message : "Unable to save profile");
    } finally {
      setIsSaving(false);
    }
  }

  if (error && !profile) {
    return <p className="text-sm text-destructive">{error}</p>;
  }

  if (!profile) {
    return <p className="text-sm text-muted-foreground">Loading profile…</p>;
  }

  return (
    <div className="space-y-3">
      <p className="text-sm">
        <strong>Email:</strong> {profile.email}
      </p>
      <div className="space-y-1">
        <label className="text-sm font-medium">Name</label>
        <Input value={name} onChange={(event) => setName(event.target.value)} />
      </div>
      <div className="space-y-1">
        <label className="text-sm font-medium">Organisation name</label>
        <Input value={orgName} onChange={(event) => setOrgName(event.target.value)} />
      </div>
      <div className="space-y-1">
        <label className="text-sm font-medium">Setting type</label>
        <Input value={settingType} onChange={(event) => setSettingType(event.target.value)} />
      </div>
      <Button onClick={saveProfile} disabled={isSaving}>
        {isSaving ? "Saving…" : "Save profile"}
      </Button>
      {message ? <p className="text-sm text-emerald-600">{message}</p> : null}
      {error ? <p className="text-sm text-destructive">{error}</p> : null}
    </div>
  );
}
