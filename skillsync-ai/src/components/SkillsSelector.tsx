"use client";

import React, { useMemo, useState } from "react";
import { Plus, Search, X } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { SkillCategory, SkillLevel, UserSkill } from "@/types";

interface SkillsSelectorProps {
  selectedSkills: UserSkill[];
  categories: SkillCategory[];
  onSkillsChange: (skills: UserSkill[]) => void;
}

const levelDescription: Record<SkillLevel, string> = {
  beginner: "Basic familiarity, still learning.",
  intermediate: "Can execute without close guidance.",
  advanced: "Strong practical command in real projects.",
  expert: "Deep mastery with mentoring ability.",
};

function getCategoryType(categoryId: string): UserSkill["category"] {
  const mapping: Record<string, UserSkill["category"]> = {
    "web-development": "technical",
    "data-analysis": "technical",
    fintech: "technical",
    "mobile-development": "technical",
    cybersecurity: "technical",
    "digital-marketing": "digital",
    "project-management": "soft",
  };

  return mapping[categoryId] ?? "technical";
}

export function SkillsSelector({ selectedSkills, categories, onSkillsChange }: SkillsSelectorProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [activeCategory, setActiveCategory] = useState<string>("all");
  const [pendingSkill, setPendingSkill] = useState<{ skillName: string; categoryId: string } | null>(null);

  const selectedNames = useMemo(
    () => new Set(selectedSkills.map((skill) => skill.name.toLowerCase())),
    [selectedSkills],
  );

  const visibleCategories = useMemo(() => {
    const term = searchTerm.toLowerCase().trim();

    return categories
      .filter((category) => activeCategory === "all" || category.id === activeCategory)
      .map((category) => ({
        ...category,
        skills: category.skills.filter((skill) => {
          if (selectedNames.has(skill.toLowerCase())) return false;
          if (!term) return true;
          return skill.toLowerCase().includes(term) || category.name.toLowerCase().includes(term);
        }),
      }))
      .filter((category) => category.skills.length > 0 || searchTerm.length === 0);
  }, [activeCategory, categories, searchTerm, selectedNames]);

  const addSkill = (skillName: string, categoryId: string, level: SkillLevel) => {
    const newSkill: UserSkill = {
      id: `${skillName}-${Date.now()}`,
      name: skillName,
      category: getCategoryType(categoryId),
      level,
    };

    onSkillsChange([...selectedSkills, newSkill]);
    setPendingSkill(null);
  };

  const removeSkill = (skillId: string) => {
    onSkillsChange(selectedSkills.filter((skill) => skill.id !== skillId));
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Select Your Current Skills</h2>
        <p className="text-gray-600">Pick skills you already have to match against Rwanda opportunities.</p>
      </div>

      {selectedSkills.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Selected Skills ({selectedSkills.length})</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              {selectedSkills.map((skill) => (
                <Badge key={skill.id} variant="secondary" className="flex items-center gap-2 py-2 px-3">
                  <span>{skill.name}</span>
                  <span className="text-xs opacity-70">({skill.level})</span>
                  <button
                    onClick={() => removeSkill(skill.id)}
                    className="hover:bg-red-100 rounded-full p-0.5"
                    aria-label={`Remove ${skill.name}`}
                  >
                    <X className="w-3 h-3" />
                  </button>
                </Badge>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
          <Input
            className="pl-10"
            placeholder="Search skills (React, SQL, Agile...)"
            value={searchTerm}
            onChange={(event) => setSearchTerm(event.target.value)}
          />
        </div>

        <div className="flex gap-2 overflow-x-auto">
          <Button
            size="sm"
            variant={activeCategory === "all" ? "default" : "outline"}
            onClick={() => setActiveCategory("all")}
          >
            All
          </Button>
          {categories.map((category) => (
            <Button
              key={category.id}
              size="sm"
              variant={activeCategory === category.id ? "default" : "outline"}
              onClick={() => setActiveCategory(category.id)}
              className="whitespace-nowrap"
            >
              {category.name}
            </Button>
          ))}
        </div>
      </div>

      <div className="space-y-4">
        {visibleCategories.length === 0 && (
          <Card>
            <CardContent className="py-6 text-sm text-gray-600">No matching skills found.</CardContent>
          </Card>
        )}

        {visibleCategories.map((category) => (
          <Card key={category.id}>
            <CardHeader>
              <div className="flex items-center justify-between gap-4">
                <div>
                  <CardTitle className="text-lg">{category.name}</CardTitle>
                  <CardDescription>{category.description}</CardDescription>
                </div>
                <div className="text-right text-xs text-gray-500">
                  <div className={cn("font-semibold", category.demandLevel === "very-high" ? "text-green-600" : "text-blue-600")}>
                    {category.demandLevel} demand
                  </div>
                  <div>{Math.round(category.avgSalaryImpact / 1000)}k RWF avg impact</div>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2">
                {category.skills.map((skillName) => (
                  <button
                    key={skillName}
                    className="inline-flex items-center gap-1 px-3 py-2 text-sm bg-gray-100 hover:bg-blue-100 rounded-md transition-colors"
                    onClick={() => setPendingSkill({ skillName, categoryId: category.id })}
                  >
                    <Plus className="w-3 h-3" />
                    {skillName}
                  </button>
                ))}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {pendingSkill && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <Card className="w-full max-w-md">
            <CardHeader>
              <CardTitle>Set Skill Level</CardTitle>
              <CardDescription>How strong are you in {pendingSkill.skillName}?</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              {(Object.keys(levelDescription) as SkillLevel[]).map((level) => (
                <Button
                  key={level}
                  variant="outline"
                  className="w-full justify-start text-left h-auto py-3"
                  onClick={() => addSkill(pendingSkill.skillName, pendingSkill.categoryId, level)}
                >
                  <div>
                    <div className="font-medium capitalize">{level}</div>
                    <div className="text-xs text-gray-500">{levelDescription[level]}</div>
                  </div>
                </Button>
              ))}
              <Button variant="ghost" className="w-full" onClick={() => setPendingSkill(null)}>
                Cancel
              </Button>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}
