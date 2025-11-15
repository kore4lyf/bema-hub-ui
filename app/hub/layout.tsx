"use client";

import { usePathname, useRouter } from "next/navigation";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Loader2, Wallet, Users, Award, Home, User, Trophy, Gift, BarChart3, UserPlus } from "lucide-react";
import { useGetProfileQuery } from "@/lib/api/authApi";
import { useAuth } from "@/hooks/useAuth";
import { Navbar } from "@/components/custom/Navbar";
import { Footer } from "@/components/custom/Footer";

export default function HubLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const { isAuthenticated } = useAuth();
  const { data: profile, isLoading: profileLoading } = useGetProfileQuery(undefined, {
    skip: !isAuthenticated
  });

  const showMiniProfile = pathname !== "/hub/profile";

  if (profileLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  if (!profile) return null;

  const initials = `${profile.first_name[0]}${profile.last_name[0]}`.toUpperCase();

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <main className="container mx-auto px-4 py-6 max-w-7xl">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <aside className="lg:col-span-3 space-y-4">
            {showMiniProfile && (
              <Card>
                <CardContent className="pt-6">
                  <div className="flex flex-col items-center text-center space-y-4">
                    <Avatar className="h-20 w-20">
                      <AvatarImage src={profile.avatar_url} />
                      <AvatarFallback className="text-lg">{initials}</AvatarFallback>
                    </Avatar>
                    <div>
                      <h3 className="font-semibold text-lg">{profile.first_name} {profile.last_name}</h3>
                      <p className="text-sm text-muted-foreground">@{profile.username}</p>
                    </div>
                    
                    <Badge variant="outline" className="text-xs">
                      {profile.bmh_tier_level}
                    </Badge>

                    <Separator />

                    <div className="w-full space-y-3">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2 text-sm">
                          <Wallet className="h-4 w-4 text-green-600" />
                          <span className="text-muted-foreground">Wallet</span>
                        </div>
                        <span className="font-semibold">${profile.bmh_wallet_balance.toFixed(2)}</span>
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2 text-sm">
                          <Users className="h-4 w-4 text-blue-600" />
                          <span className="text-muted-foreground">Referrals</span>
                        </div>
                        <span className="font-semibold">{profile.bmh_referral_count}</span>
                      </div>

                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2 text-sm">
                          <Award className="h-4 w-4 text-purple-600" />
                          <span className="text-muted-foreground">Badge</span>
                        </div>
                        <span className="font-semibold text-xs">{profile.bmh_across_campaign_badge || "None"}</span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            <Card>
              <CardContent className="p-3">
                <nav className="space-y-1">
                  <Button 
                    variant={pathname === "/hub" ? "secondary" : "ghost"} 
                    className="w-full justify-start" 
                    onClick={() => router.push("/hub")}
                  >
                    <Home className="h-4 w-4 mr-3" />
                    Hub
                  </Button>
                  <Button 
                    variant={pathname === "/hub/profile" ? "secondary" : "ghost"} 
                    className="w-full justify-start" 
                    onClick={() => router.push("/hub/profile")}
                  >
                    <User className="h-4 w-4 mr-3" />
                    Profile
                  </Button>
                  <Button 
                    variant={pathname === "/hub/leaderboard" ? "secondary" : "ghost"} 
                    className="w-full justify-start"
                    onClick={() => router.push("/hub/leaderboard")}
                  >
                    <Trophy className="h-4 w-4 mr-3" />
                    Leaderboard
                  </Button>
                  <Button 
                    variant={pathname === "/hub/rewards" ? "secondary" : "ghost"} 
                    className="w-full justify-start"
                    onClick={() => router.push("/hub/rewards")}
                  >
                    <Gift className="h-4 w-4 mr-3" />
                    Rewards
                  </Button>
                  <Button 
                    variant={pathname === "/hub/campaigns" ? "secondary" : "ghost"} 
                    className="w-full justify-start"
                    onClick={() => router.push("/hub/campaigns")}
                  >
                    <BarChart3 className="h-4 w-4 mr-3" />
                    My Campaigns
                  </Button>
                  <Button 
                    variant={pathname === "/hub/referrals" ? "secondary" : "ghost"} 
                    className="w-full justify-start"
                    onClick={() => router.push("/hub/referrals")}
                  >
                    <UserPlus className="h-4 w-4 mr-3" />
                    Referrals
                  </Button>
                </nav>
              </CardContent>
            </Card>
          </aside>

          <div className="lg:col-span-9">
            {children}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
