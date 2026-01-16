"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form"; // Assuming we install this or use simple state
// Minimal state approach to avoid extra deps if poss, but hook-form is better. 
// User asked to use any/unused vars ignored so we can code fast.

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { toast } from "sonner"; // Use sonner
import { Search } from "lucide-react";

import { updateProfileAction } from "@/actions/user";
import { PREDEFINED_TAGS, INDIAN_STATES, COLLEGE_YEARS, LANGUAGES, GENDERS, TAG_CATEGORIES } from "@/lib/constants";
import GlassSurface from "@/components/GlassSurface";

export default function Onboarding() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  
  const [formData, setFormData] = useState({
    userName: "",
    collegeYear: "",
    homeState: "",
    language: "",
    gender: "",
    introduction: "",
    preference: "",
  });

  const handleTagToggle = (tag: string) => {
    if (selectedTags.includes(tag)) {
      setSelectedTags(selectedTags.filter(t => t !== tag));
    } else {
      if (selectedTags.length >= 5) {
        toast.error("You can only select 5 tags.");
        return;
      }
      setSelectedTags([...selectedTags, tag]);
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async () => {
    setLoading(true);
    
    // Basic validation
    if (selectedTags.length !== 5) {
      toast.error("Please select exactly 5 tags.");
      setLoading(false);
      return;
    }
    if (!formData.userName || !formData.collegeYear || !formData.homeState || !formData.introduction) {
        toast.error("Please fill in all required fields.");
        setLoading(false);
        return;
    }

    try {
      const res = await updateProfileAction({
        ...formData,
        tags: selectedTags,
        // map string values to types if needed, or rely on loose types
      } as any);

      if (res.success) {
        toast.success("Profile updated!");
        router.push("/dashboard");
      } else {
        toast.error(res.error || "Failed to update profile");
      }
    } catch (e) {
      toast.error("Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-neutral-950 text-neutral-100 p-6 flex justify-center items-start pt-20">
      <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
          {/* Background decoration */}
          <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] bg-blue-900/20 rounded-full blur-[100px]" />
          <div className="absolute bottom-[-20%] right-[-10%] w-[50%] h-[50%] bg-red-900/20 rounded-full blur-[100px]" />
      </div>

      <GlassSurface width="100%" height="auto" borderRadius={24} className="max-w-3xl z-10">
      <Card className="bg-transparent border-0 text-neutral-100 w-full overflow-hidden">
        <CardHeader>
          <CardTitle className="text-3xl text-center">
            <span className="text-blue-500">Complete</span> Your Profile
          </CardTitle>
          <CardDescription className="text-center text-neutral-400">
            Tell us about yourself to find the best anonymous matches.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          
          {/* Username */}
          <div className="space-y-2">
            <Label>Username (Anonymous)</Label>
            <Input 
                placeholder="Choose a display name" 
                value={formData.userName}
                onChange={(e) => handleInputChange("userName", e.target.value)}
                className="bg-neutral-900/50 border-neutral-700"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* College Year */}
            <div className="space-y-2">
                <Label>College Year</Label>
                <Select onValueChange={(val) => handleInputChange("collegeYear", val)}>
                    <SelectTrigger className="bg-neutral-900/50 border-neutral-700">
                        <SelectValue placeholder="Select Year" />
                    </SelectTrigger>
                    <SelectContent className="bg-neutral-900 border-neutral-800 text-neutral-100">
                        {COLLEGE_YEARS.map(y => <SelectItem key={y} value={y}>{y} Year</SelectItem>)}
                    </SelectContent>
                </Select>
            </div>

            {/* Gender */}
            <div className="space-y-2">
                <Label>Gender</Label>
                <Select onValueChange={(val) => handleInputChange("gender", val)}>
                    <SelectTrigger className="bg-neutral-900/50 border-neutral-700">
                        <SelectValue placeholder="Select Gender" />
                    </SelectTrigger>
                    <SelectContent className="bg-neutral-900 border-neutral-800 text-neutral-100">
                        {GENDERS.map(g => <SelectItem key={g} value={g}>{g}</SelectItem>)}
                    </SelectContent>
                </Select>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
             {/* Home State */}
             <div className="space-y-2">
                <Label>Home State</Label>
                <Select onValueChange={(val) => handleInputChange("homeState", val)}>
                    <SelectTrigger className="bg-neutral-900/50 border-neutral-700">
                        <SelectValue placeholder="Select State" />
                    </SelectTrigger>
                    <SelectContent className="bg-neutral-900 border-neutral-800 text-neutral-100 h-[300px]">
                        {INDIAN_STATES.map(s => <SelectItem key={s} value={s}>{s}</SelectItem>)}
                    </SelectContent>
                </Select>
            </div>

            {/* Language */}
            <div className="space-y-2">
                <Label>Preferred Language</Label>
                <Select onValueChange={(val) => handleInputChange("language", val)}>
                    <SelectTrigger className="bg-neutral-900/50 border-neutral-700">
                        <SelectValue placeholder="Select Language" />
                    </SelectTrigger>
                    <SelectContent className="bg-neutral-900 border-neutral-800 text-neutral-100">
                        {LANGUAGES.map(l => <SelectItem key={l} value={l}>{l}</SelectItem>)}
                    </SelectContent>
                </Select>
            </div>
          </div>

          {/* Introduction */}
          <div className="space-y-2">
            <Label>Introduction (About You)</Label>
            <Textarea 
                placeholder="I love coding and late night coffee..." 
                className="bg-neutral-900/50 border-neutral-700 h-24" 
                value={formData.introduction}
                onChange={(e) => handleInputChange("introduction", e.target.value)}
            />
          </div>

          {/* Preference */}
          <div className="space-y-2">
            <Label>Preference (Who do you want to match with?)</Label>
            <Textarea 
                placeholder="Someone who likes anime and tech..." 
                className="bg-neutral-900/50 border-neutral-700 h-24"
                value={formData.preference}
                onChange={(e) => handleInputChange("preference", e.target.value)}
            />
          </div>

          {/* Tags */}
          <div className="space-y-3">
            <div className="flex justify-between items-center">
                <Label>Interests (Select exactly 5)</Label>
                <div className="text-xs text-neutral-400">
                    {selectedTags.length}/5 selected
                </div>
            </div>
            
            {/* Search Bar */}
            <div className="relative">
                <Search className="absolute left-3 top-2.5 h-4 w-4 text-neutral-400" />
                <Input 
                    placeholder="Search tags..." 
                    className="pl-9 bg-neutral-900/50 border-neutral-700 text-white placeholder:text-neutral-500"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                />
            </div>

            <div className="h-[300px] overflow-y-auto pr-2 space-y-4 p-4 rounded-md border border-neutral-800 bg-neutral-900/30 custom-scrollbar">
                {searchQuery ? (
                    // Search Results
                    <div className="flex flex-wrap gap-2">
                        {PREDEFINED_TAGS
                            .filter(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()))
                            .map(tag => {
                            const isSelected = selectedTags.includes(tag);
                            return (
                                <Badge 
                                    key={tag}
                                    variant={isSelected ? "default" : "secondary"}
                                    className={`cursor-pointer px-3 py-1 text-sm border transition-all ${isSelected ? 'bg-blue-600 hover:bg-blue-500 text-white border-blue-500' : 'bg-neutral-800 hover:bg-neutral-700 text-white border-neutral-700'}`}
                                    onClick={() => handleTagToggle(tag)}
                                >
                                    {tag}
                                </Badge>
                            );
                        })}
                        {PREDEFINED_TAGS.filter(tag => tag.toLowerCase().includes(searchQuery.toLowerCase())).length === 0 && (
                            <div className="text-neutral-500 text-sm">No tags found.</div>
                        )}
                    </div>
                ) : (
                    // Categorized View
                    Object.entries(TAG_CATEGORIES).map(([category, tags]) => (
                        <div key={category} className="space-y-2">
                            <h4 className="text-xs font-semibold text-neutral-400 uppercase tracking-wider sticky top-0 bg-[#0a0a0a] py-1 z-10">{category}</h4>
                            <div className="flex flex-wrap gap-2">
                                {tags.map(tag => {
                                    const isSelected = selectedTags.includes(tag);
                                    return (
                                        <Badge 
                                            key={tag}
                                            variant={isSelected ? "default" : "secondary"}
                                            className={`cursor-pointer px-3 py-1 text-sm border transition-all ${isSelected ? 'bg-blue-600 hover:bg-blue-500 text-white border-blue-500' : 'bg-neutral-800 hover:bg-neutral-700 text-white border-neutral-700'}`}
                                            onClick={() => handleTagToggle(tag)}
                                        >
                                            {tag}
                                        </Badge>
                                    );
                                })}
                            </div>
                        </div>
                    ))
                )}
            </div>
          </div>

          <Button 
            className="w-full bg-gradient-to-r from-blue-600 to-red-600 hover:opacity-90 mt-4" 
            size="lg"
            onClick={handleSubmit}
            disabled={loading}
          >
            {loading ? "Saving Profile..." : "Complete Registration"}
          </Button>

        </CardContent>
      </Card>
      </GlassSurface>
    </div>
  )
}
