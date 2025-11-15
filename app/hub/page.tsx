"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Loader2, MessageCircle, Calendar, MapPin, ExternalLink, ChevronRight, Users } from "lucide-react";
import { useGetPostsQuery } from "@/lib/api/blogApi";

export default function HubPage() {
  const router = useRouter();
  const { data: blogPosts = [], isLoading: postsLoading } = useGetPostsQuery({ per_page: 5, _embed: true });
  
  const [activeTab, setActiveTab] = useState("campaigns");
  const [expandedComments, setExpandedComments] = useState<number[]>([]);

  const toggleComments = (postId: number) => {
    setExpandedComments(prev => 
      prev.includes(postId) ? prev.filter(id => id !== postId) : [...prev, postId]
    );
  };

  // Mock data for campaigns and events (replace with actual API calls)
  const campaigns = [
    {
      id: 1,
      title: "Summer Music Festival Campaign",
      description: "Join our exclusive summer festival promotion and earn rewards!",
      image: "https://images.unsplash.com/photo-1459749411175-04bf5292ceea?w=400",
      status: "active",
      participants: 234,
      endDate: "2025-12-31"
    },
    {
      id: 2,
      title: "Artist Spotlight Series",
      description: "Help promote emerging artists and get exclusive access to their content.",
      image: "https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=400",
      status: "active",
      participants: 156,
      endDate: "2025-11-30"
    }
  ];

  const events = [
    {
      id: 1,
      title: "Live Concert: The Midnight Sessions",
      description: "An intimate acoustic performance featuring top indie artists.",
      image: "https://images.unsplash.com/photo-1501281668745-f7f57925c3b4?w=400",
      date: "2025-11-20",
      location: "Virtual Event",
      attendees: 450
    },
    {
      id: 2,
      title: "Music Industry Networking Mixer",
      description: "Connect with industry professionals and fellow music enthusiasts.",
      image: "https://images.unsplash.com/photo-1540039155733-5bb30b53aa14?w=400",
      date: "2025-11-25",
      location: "Los Angeles, CA",
      attendees: 120
    }
  ];

  return (
    <div className="space-y-6">
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-3 h-12">
          <TabsTrigger value="campaigns">Campaigns</TabsTrigger>
          <TabsTrigger value="events">Events</TabsTrigger>
          <TabsTrigger value="blog">Blog</TabsTrigger>
        </TabsList>

        {/* Campaigns Tab */}
        <TabsContent value="campaigns" className="space-y-4 mt-6">
            {campaigns.map((campaign) => (
              <Card key={campaign.id} className="overflow-hidden hover:shadow-lg transition-shadow">
                <div className="md:flex">
                          <div className="md:w-1/3 h-48 md:h-auto relative">
                            <img 
                              src={campaign.image} 
                              alt={campaign.title}
                              className="w-full h-full object-cover"
                            />
                            <Badge className="absolute top-3 right-3 bg-green-600">
                              {campaign.status}
                            </Badge>
                          </div>
                          <div className="md:w-2/3 p-6">
                            <div className="flex items-start justify-between mb-3">
                              <div>
                                <h3 className="text-xl font-semibold mb-2">{campaign.title}</h3>
                                <p className="text-muted-foreground text-sm">{campaign.description}</p>
                              </div>
                            </div>
                            
                            <div className="flex items-center gap-4 text-sm text-muted-foreground mb-4">
                              <div className="flex items-center gap-1">
                                <Users className="h-4 w-4" />
                                <span>{campaign.participants} participants</span>
                              </div>
                              <div className="flex items-center gap-1">
                                <Calendar className="h-4 w-4" />
                                <span>Ends {new Date(campaign.endDate).toLocaleDateString()}</span>
                              </div>
                            </div>

                            <Button className="w-full md:w-auto">
                              Join Campaign
                              <ChevronRight className="h-4 w-4 ml-2" />
                            </Button>
                          </div>
                        </div>
                      </Card>
                    ))}
                  </TabsContent>

                  {/* Events Tab */}
                  <TabsContent value="events" className="space-y-4 mt-6">
                    {events.map((event) => (
                      <Card key={event.id} className="overflow-hidden hover:shadow-lg transition-shadow">
                        <div className="md:flex">
                          <div className="md:w-1/3 h-48 md:h-auto relative">
                            <img 
                              src={event.image} 
                              alt={event.title}
                              className="w-full h-full object-cover"
                            />
                          </div>
                          <div className="md:w-2/3 p-6">
                            <h3 className="text-xl font-semibold mb-2">{event.title}</h3>
                            <p className="text-muted-foreground text-sm mb-4">{event.description}</p>
                            
                            <div className="space-y-2 text-sm mb-4">
                              <div className="flex items-center gap-2 text-muted-foreground">
                                <Calendar className="h-4 w-4" />
                                <span>{new Date(event.date).toLocaleDateString('en-US', { 
                                  weekday: 'long', 
                                  year: 'numeric', 
                                  month: 'long', 
                                  day: 'numeric' 
                                })}</span>
                              </div>
                              <div className="flex items-center gap-2 text-muted-foreground">
                                <MapPin className="h-4 w-4" />
                                <span>{event.location}</span>
                              </div>
                              <div className="flex items-center gap-2 text-muted-foreground">
                                <Users className="h-4 w-4" />
                                <span>{event.attendees} attending</span>
                              </div>
                            </div>

                            <Button className="w-full md:w-auto">
                              Register Now
                              <ExternalLink className="h-4 w-4 ml-2" />
                            </Button>
                          </div>
                        </div>
                      </Card>
                    ))}
                  </TabsContent>

                  {/* Blog Tab */}
                  <TabsContent value="blog" className="space-y-4 mt-6">
                    {postsLoading ? (
                      <div className="flex justify-center py-8">
                        <Loader2 className="h-6 w-6 animate-spin" />
                      </div>
                    ) : blogPosts.length === 0 ? (
                      <Card>
                        <CardContent className="py-8 text-center text-muted-foreground">
                          No blog posts available
                        </CardContent>
                      </Card>
                    ) : (
                      blogPosts.map((post) => {
                        const featuredImage = post._embedded?.['wp:featuredmedia']?.[0]?.source_url;
                        const author = post._embedded?.author?.[0];
                        const isExpanded = expandedComments.includes(post.id);

                        return (
                          <Card key={post.id} className="overflow-hidden hover:shadow-lg transition-shadow">
                            {featuredImage && (
                              <div className="h-64 relative">
                                <img 
                                  src={featuredImage} 
                                  alt={post.title.rendered}
                                  className="w-full h-full object-cover"
                                />
                              </div>
                            )}
                            <CardContent className="p-6">
                              <div className="flex items-center gap-3 mb-4">
                                {author && (
                                  <>
                                    <Avatar className="h-8 w-8">
                                      <AvatarImage src={author.avatar_urls?.['48']} />
                                      <AvatarFallback>{author.name[0]}</AvatarFallback>
                                    </Avatar>
                                    <div className="text-sm">
                                      <p className="font-medium">{author.name}</p>
                                      <p className="text-muted-foreground text-xs">
                                        {new Date(post.date).toLocaleDateString()}
                                      </p>
                                    </div>
                                  </>
                                )}
                              </div>

                              <h3 
                                className="text-xl font-semibold mb-3 cursor-pointer hover:text-primary"
                                onClick={() => router.push(`/blog/${post.slug}`)}
                                dangerouslySetInnerHTML={{ __html: post.title.rendered }}
                              />
                              
                              <div 
                                className="text-muted-foreground text-sm mb-4 line-clamp-3"
                                dangerouslySetInnerHTML={{ __html: post.excerpt.rendered }}
                              />

                              <Separator className="my-4" />

                              <div className="flex items-center justify-between">
                                <Button 
                                  variant="ghost" 
                                  size="sm"
                                  onClick={() => toggleComments(post.id)}
                                >
                                  <MessageCircle className="h-4 w-4 mr-2" />
                                  Comments (0)
                                </Button>
                                <Button 
                                  variant="ghost" 
                                  size="sm"
                                  onClick={() => router.push(`/blog/${post.slug}`)}
                                >
                                  Read More
                                  <ChevronRight className="h-4 w-4 ml-2" />
                                </Button>
                              </div>

                              {isExpanded && (
                                <div className="mt-4 pt-4 border-t">
                                  <p className="text-sm text-muted-foreground text-center py-4">
                                    No comments yet. Be the first to comment!
                                  </p>
                                </div>
                              )}
                            </CardContent>
                          </Card>
                        );
                      })
                    )}
                  </TabsContent>
                </Tabs>
    </div>
  );
}
