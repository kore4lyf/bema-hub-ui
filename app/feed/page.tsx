"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  Heart,
  MessageCircle,
  Share2,
  MoreHorizontal,
  TrendingUp,
  Users,
  Hash,
  Plus,
  Send,
  Bookmark,
  MapPin,
  Calendar,
  Image as ImageIcon,
  Smile,
  ThumbsUp,
  Crown,
  CheckCircle,
  Star
} from "lucide-react";
import { Navbar } from "@/components/custom/Navbar";
import { Footer } from "@/components/custom/Footer";

// Mock data for posts
const posts = [
  {
    id: 1,
    user: {
      name: "Sarah Johnson",
      username: "sarahj",
      avatar: "/avatars/sarah.jpg",
      verified: true,
      tier: "Gold"
    },
    content: "Just launched my new creative project! 🚀 Really excited to share this journey with everyone. The amount of love and support from the community means the world to me.",
    images: ["/posts/project-launch.jpg"],
    timestamp: "2 hours ago",
    likes: 1247,
    comments: 89,
    shares: 23,
    liked: false,
    bookmarked: false
  },
  {
    id: 2,
    user: {
      name: "Alex Chen",
      username: "alexchen",
      avatar: "/avatars/alex.jpg",
      verified: false,
      tier: "Silver"
    },
    content: "Beautiful sunset from the rooftop tonight. Sometimes you just need to pause and appreciate the simple moments in life. 🌅",
    images: ["/posts/sunset.jpg", "/posts/sunset2.jpg"],
    timestamp: "4 hours ago",
    likes: 892,
    comments: 34,
    shares: 12,
    liked: true,
    bookmarked: true
  },
  {
    id: 3,
    user: {
      name: "Maya Patel",
      username: "mayap",
      avatar: "/avatars/maya.jpg",
      verified: true,
      tier: "Platinum"
    },
    content: "Exciting news! We're expanding our team and looking for passionate developers to join our mission. If you're interested in building the future of creative tools, DM me! 💼",
    images: [],
    timestamp: "6 hours ago",
    likes: 567,
    comments: 156,
    shares: 45,
    liked: false,
    bookmarked: false
  }
];

// Suggested users
const suggestedUsers = [
  { name: "David Kim", username: "davidk", avatar: "/avatars/david.jpg", mutualFollowers: 12 },
  { name: "Emma Wilson", username: "emmaw", avatar: "/avatars/emma.jpg", mutualFollowers: 8 },
  { name: "James Liu", username: "jamesl", avatar: "/avatars/james.jpg", mutualFollowers: 15 }
];

// Trending topics
const trendingTopics = [
  { tag: "#CreativeJourney", posts: "2.1k" },
  { tag: "#TechInnovation", posts: "1.8k" },
  { tag: "#CommunityFirst", posts: "956" },
  { tag: "#FutureOfWork", posts: "742" }
];

export default function FeedPage() {
  const [postsData, setPostsData] = useState(posts);

  const handleLike = (postId: number) => {
    setPostsData(prev => prev.map(post =>
      post.id === postId
        ? { ...post, liked: !post.liked, likes: post.liked ? post.likes - 1 : post.likes + 1 }
        : post
    ));
  };

  const handleBookmark = (postId: number) => {
    setPostsData(prev => prev.map(post =>
      post.id === postId ? { ...post, bookmarked: !post.bookmarked } : post
    ));
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Main Feed */}
          <div className="lg:col-span-3 space-y-6">
            {/* Create Post Card */}
            <Card className="bg-white shadow-sm border-gray-200">
              <CardContent className="p-6">
                <div className="flex space-x-4">
                  <Avatar className="h-12 w-12">
                    <AvatarImage src="/avatars/user.jpg" />
                    <AvatarFallback>You</AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <div className="bg-gray-100 rounded-full px-4 py-3 cursor-pointer hover:bg-gray-200 transition-colors">
                      <span className="text-gray-500">What's on your mind?</span>
                    </div>
                    <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-100">
                      <div className="flex space-x-4">
                        <Button variant="ghost" size="sm" className="text-gray-600 hover:text-blue-600">
                          <ImageIcon className="h-5 w-5 mr-2" />
                          Photo
                        </Button>
                        <Button variant="ghost" size="sm" className="text-gray-600 hover:text-green-600">
                          <MapPin className="h-5 w-5 mr-2" />
                          Location
                        </Button>
                        <Button variant="ghost" size="sm" className="text-gray-600 hover:text-purple-600">
                          <Smile className="h-5 w-5 mr-2" />
                          Mood
                        </Button>
                      </div>
                      <Button size="sm" className="bg-blue-600 hover:bg-blue-700">
                        <Send className="h-4 w-4 mr-2" />
                        Post
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Posts Feed */}
            {postsData.map((post) => (
              <Card key={post.id} className="bg-white shadow-sm border-gray-200 overflow-hidden">
                {/* Post Header */}
                <CardHeader className="pb-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <Avatar className="h-10 w-10">
                        <AvatarImage src={post.user.avatar} />
                        <AvatarFallback>{post.user.name[0]}</AvatarFallback>
                      </Avatar>
                      <div>
                        <div className="flex items-center space-x-2">
                          <h3 className="font-semibold text-gray-900">{post.user.name}</h3>
                          {post.user.verified && (
                            <Badge variant="secondary" className="bg-blue-100 text-blue-800">
                              <CheckCircle className="h-3 w-3 mr-1" />
                              Verified
                            </Badge>
                          )}
                          <Badge variant="outline" className="text-xs">
                            <Crown className="h-3 w-3 mr-1" />
                            {post.user.tier}
                          </Badge>
                        </div>
                        <p className="text-sm text-gray-500">@{post.user.username} · {post.timestamp}</p>
                      </div>
                    </div>
                    <Button variant="ghost" size="sm">
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </div>
                </CardHeader>

                {/* Post Content */}
                <CardContent className="pt-0">
                  <div className="space-y-4">
                    <p className="text-gray-900 leading-relaxed">{post.content}</p>

                    {post.images.length > 0 && (
                      <div className={`grid gap-2 ${post.images.length > 1 ? 'grid-cols-2' : 'grid-cols-1'}`}>
                        {post.images.map((image, index) => (
                          <div key={index} className="relative rounded-lg overflow-hidden bg-gray-100">
                            <img
                              src={image}
                              alt={`Post image ${index + 1}`}
                              className="w-full h-64 object-cover hover:scale-105 transition-transform duration-200"
                            />
                          </div>
                        ))}
                      </div>
                    )}

                    {/* Engagement Stats */}
                    <div className="flex items-center justify-between pt-2">
                      <div className="flex items-center space-x-6 text-sm text-gray-500">
                        <span>{post.likes.toLocaleString()} likes</span>
                        <span>{post.comments} comments</span>
                        <span>{post.shares} shares</span>
                      </div>
                      <Button variant="ghost" size="sm">
                        <TrendingUp className="h-4 w-4" />
                      </Button>
                    </div>

                    <Separator />

                    {/* Action Buttons */}
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-1">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleLike(post.id)}
                          className={`${post.liked ? 'text-red-600 hover:text-red-700' : 'text-gray-600 hover:text-red-600'} flex-1 justify-center`}
                        >
                          <Heart className={`h-5 w-5 mr-2 ${post.liked ? 'fill-current' : ''}`} />
                          Like
                        </Button>
                        <Button variant="ghost" size="sm" className="text-gray-600 hover:text-blue-600 flex-1 justify-center">
                          <MessageCircle className="h-5 w-5 mr-2" />
                          Comment
                        </Button>
                        <Button variant="ghost" size="sm" className="text-gray-600 hover:text-green-600 flex-1 justify-center">
                          <Share2 className="h-5 w-5 mr-2" />
                          Share
                        </Button>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleBookmark(post.id)}
                        className={post.bookmarked ? 'text-blue-600' : 'text-gray-600'}
                      >
                        <Bookmark className={`h-5 w-5 ${post.bookmarked ? 'fill-current' : ''}`} />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Suggested Users */}
            <Card className="bg-white shadow-sm border-gray-200">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users className="h-5 w-5 text-blue-600" />
                  Suggested for you
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {suggestedUsers.map((user, index) => (
                  <div key={user.username} className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <Avatar className="h-10 w-10">
                        <AvatarImage src={user.avatar} />
                        <AvatarFallback>{user.name[0]}</AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="font-medium text-sm text-gray-900">{user.name}</p>
                        <p className="text-xs text-gray-500">{user.mutualFollowers} mutual followers</p>
                      </div>
                    </div>
                    <Button variant="outline" size="sm">
                      <Plus className="h-4 w-4 mr-1" />
                      Follow
                    </Button>
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Trending Topics */}
            <Card className="bg-white shadow-sm border-gray-200">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="h-5 w-5 text-orange-600" />
                  Trending Topics
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {trendingTopics.map((topic, index) => (
                    <div key={topic.tag} className="flex items-center justify-between">
                      <div>
                        <p className="font-medium text-sm text-gray-900">{topic.tag}</p>
                        <p className="text-xs text-gray-500">{topic.posts} posts</p>
                      </div>
                      <Button variant="ghost" size="sm">
                        <Hash className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Community Stats */}
            <Card className="bg-gradient-to-r from-blue-500 to-purple-600 text-white border-0">
              <CardContent className="p-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className="h-10 w-10 bg-white/20 rounded-lg flex items-center justify-center">
                    <Star className="h-6 w-6" />
                  </div>
                  <div>
                    <h3 className="font-semibold">Community Stats</h3>
                    <p className="text-sm text-white/80">Growing together</p>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="text-center">
                    <div className="text-2xl font-bold">12.5k</div>
                    <div className="text-xs text-white/80">Members</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold">8.2k</div>
                    <div className="text-xs text-white/80">Posts</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
