"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { toast } from "sonner";
import { Download, Trash2 } from "lucide-react";

export default function DangerPage() {
  const router = useRouter();
  const supabase = createClient();
  const [confirmText, setConfirmText] = useState("");
  const [deleting, setDeleting] = useState(false);

  const handleExport = async () => {
    const { data: prompts } = await supabase
      .from("prompts")
      .select("*")
      .eq("is_archived", false);

    const exportData = {
      exportedAt: new Date().toISOString(),
      prompts: prompts ?? [],
    };

    const blob = new Blob([JSON.stringify(exportData, null, 2)], {
      type: "application/json",
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `promptvault-export-${new Date().toISOString().split("T")[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);

    toast.success("Data exported");
  };

  const handleDeleteAccount = async () => {
    if (confirmText !== "DELETE") return;
    setDeleting(true);

    const user = await supabase.auth.getUser();
    if (user.data.user) {
      // Delete user-owned data
      await supabase.from("prompts").delete().eq("user_id", user.data.user.id);
      await supabase.from("collections").delete().eq("user_id", user.data.user.id);
      await supabase.from("tags").delete().eq("user_id", user.data.user.id);
      await supabase.from("users").delete().eq("id", user.data.user.id);
    }

    await supabase.auth.signOut();
    toast.success("Account data deleted. Signed out.");
    router.push("/");
    router.refresh();
  };

  return (
    <div className="mx-auto max-w-2xl space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-text">Danger Zone</h1>
        <p className="text-sm text-muted">Irreversible and destructive actions</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Export Data</CardTitle>
          <CardDescription>
            Download all your prompts and collections as a JSON file
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Button variant="outline" className="gap-2" onClick={handleExport}>
            <Download className="h-4 w-4" />
            Export as JSON
          </Button>
        </CardContent>
      </Card>

      <Card className="border-danger/50">
        <CardHeader>
          <CardTitle>Delete Account</CardTitle>
          <CardDescription>
            Permanently delete your account and all associated data. This action
            cannot be undone.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Dialog>
            <DialogTrigger asChild>
              <Button variant="destructive" className="gap-2">
                <Trash2 className="h-4 w-4" />
                Delete Account
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Are you absolutely sure?</DialogTitle>
                <DialogDescription>
                  This will permanently delete your account and all your prompts,
                  collections, and data. This action cannot be undone.
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4">
                <div className="space-y-1.5">
                  <Label htmlFor="confirm">
                    Type <span className="font-bold text-danger">DELETE</span> to
                    confirm
                  </Label>
                  <Input
                    id="confirm"
                    value={confirmText}
                    onChange={(e) => setConfirmText(e.target.value)}
                    placeholder="Type DELETE to confirm"
                  />
                </div>
                <Button
                  variant="destructive"
                  className="w-full"
                  disabled={confirmText !== "DELETE" || deleting}
                  onClick={handleDeleteAccount}
                >
                  {deleting ? "Deleting..." : "Delete My Account"}
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </CardContent>
      </Card>
    </div>
  );
}
