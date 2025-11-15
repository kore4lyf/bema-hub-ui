"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Target } from "lucide-react";

export default function CampaignsPage() {
  return (
    <div className="container py-8 px-4 sm:px-6 mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight">My Campaigns</h1>
        <p className="text-muted-foreground mt-2">
          Manage your active campaigns
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Active Campaigns</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8 text-muted-foreground">
            <Target className="h-12 w-12 mx-auto mb-4 opacity-50" />
            <p>No campaigns found</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
