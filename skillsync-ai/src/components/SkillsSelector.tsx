'use client';

import React, { useState, useMemo } from 'react';
import { Search, Plus, X } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { RWANDA_SKILL_CATEGORIES } from '@/data/rwanda-skills';
import { UserSkill, SkillCategory } from '@/types';
import { cn } from '@/lib/utils';

interface SkillsSelectorProps {
  selectedSkills: UserSkill[];
  onSkillsChange: (skills: UserSkill[]) => void;
  className?: string;
}

type SkillLevel = 'beginner' | 'intermediate' | 'advanced' | 'expert';

export function SkillsSelector({ selectedSkills, onSkillsChange, className }: SkillsSelectorProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [showLevelSelector, setShowLevelSelector] = useState<string | null>(null);

  // Filter skills based on search and category
  const filteredCategories = useMemo(() => {
    if (selectedCategory === 'all') {
      return RWANDA_SKILL_CATEGORIES.filter(category =>
        category.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        category.skills.some(skill => skill.toLowerCase().includes(searchTerm.toLowerCase()))
      );
    }
    return RWANDA_SKILL_CATEGORIES.filter(category => 
      category.id === selectedCategory &&
      (category.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
       category.skills.some(skill => skill.toLowerCase().includes(searchTerm.toLowerCase())))
    );
  }, [searchTerm, selectedCategory]);

  // Get available skills (not already selected)
  const getAvailableSkills = (category: SkillCategory) => {
    const selectedSkillNames = selectedSkills.map(s => s.name);
    return category.skills.filter(skill => 
      !selectedSkillNames.includes(skill) &&
      skill.toLowerCase().includes(searchTerm.toLowerCase())
    );
  };

  const addSkill = (skillName: string) => {
    setShowLevelSelector(skillName);
  };

  const confirmSkill = (skillName: string, level: SkillLevel) => {
    const newSkill: UserSkill = {
      id: `${skillName}-${Date.now()}`,
      name: skillName,
      category: getCategoryType(skillName),
      level: level
    };
    
    onSkillsChange([...selectedSkills, newSkill]);
    setShowLevelSelector(null);
  };

  const removeSkill = (skillId: string) => {
    onSkillsChange(selectedSkills.filter(skill => skill.id !== skillId));
  };

  const getCategoryType = (skillName: string): UserSkill['category'] => {
    const category = RWANDA_SKILL_CATEGORIES.find(cat => 
      cat.skills.includes(skillName)
    );
    
    // Map category IDs to skill categories
    const categoryMap: Record<string, UserSkill['category']> = {
      'web-development': 'technical',
      'data-analysis': 'technical',
      'mobile-development': 'technical',
      'fintech': 'technical',
      'cybersecurity': 'technical',
      'digital-marketing': 'digital',
      'project-management': 'soft'
    };
    
    return category ? categoryMap[category.id] || 'technical' : 'technical';
  };

  const getDemandIndicator = (demandLevel: string) => {
    const indicators = {
      'very-high': { color: 'text-green-600', symbol: '🔥', text: 'Very High Demand' },
      'high': { color: 'text-blue-600', symbol: '📈', text: 'High Demand' },
      'medium': { color: 'text-yellow-600', symbol: '📊', text: 'Medium Demand' },
      'low': { color: 'text-gray-600', symbol: '📉', text: 'Low Demand' }
    };
    return indicators[demandLevel as keyof typeof indicators] || indicators.medium;
  };

  return (
    <div className={cn('space-y-6', className)}>
      {/* Header */}
      <div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          Select Your Skills
        </h2>
        <p className="text-gray-600">
          Choose skills you already have. We'll analyze Rwanda job opportunities for you.
        </p>
      </div>

      {/* Selected Skills */}
      {selectedSkills.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Your Skills ({selectedSkills.length})</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              {selectedSkills.map((skill) => (
                <Badge 
                  key={skill.id}
                  variant="secondary"
                  className="flex items-center gap-2 py-2 px-3"
                >
                  <span>{skill.name}</span>
                  <span className="text-xs opacity-70">({skill.level})</span>
                  <button
                    onClick={() => removeSkill(skill.id)}
                    className="hover:bg-red-100 rounded-full p-0.5"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </Badge>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Search and Filter */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          <Input
            placeholder="Search for skills (e.g., React, Python, Marketing)..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        <div className="flex gap-2 overflow-x-auto">
          <Button
            variant={selectedCategory === 'all' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setSelectedCategory('all')}
          >
            All Skills
          </Button>
          {RWANDA_SKILL_CATEGORIES.map((category) => (
            <Button
              key={category.id}
              variant={selectedCategory === category.id ? 'default' : 'outline'}
              size="sm"
              onClick={() => setSelectedCategory(category.id)}
              className="whitespace-nowrap"
            >
              {category.name}
            </Button>
          ))}
        </div>
      </div>

      {/* Skills Grid */}
      <div className="grid gap-6">
        {filteredCategories.map((category) => {
          const availableSkills = getAvailableSkills(category);
          const demand = getDemandIndicator(category.demandLevel);
          
          if (availableSkills.length === 0 && searchTerm) return null;

          return (
            <Card key={category.id} className="relative">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="text-lg">{category.name}</CardTitle>
                    <CardDescription>{category.description}</CardDescription>
                  </div>
                  <div className="text-right">
                    <div className={cn("text-sm font-medium", demand.color)}>
                      {demand.symbol} {demand.text}
                    </div>
                    <div className="text-xs text-gray-500 mt-1">
                      Avg salary impact: {(category.avgSalaryImpact / 1000).toFixed(0)}k RWF
                    </div>
                  </div>
                </div>
              </CardHeader>
              
              <CardContent>
                {availableSkills.length > 0 ? (
                  <div className="flex flex-wrap gap-2">
                    {availableSkills.map((skillName) => (
                      <button
                        key={skillName}
                        onClick={() => addSkill(skillName)}
                        className="inline-flex items-center gap-1 px-3 py-2 text-sm bg-gray-100 hover:bg-blue-100 rounded-md transition-colors"
                      >
                        <Plus className="w-3 h-3" />
                        {skillName}
                      </button>
                    ))}
                  </div>
                ) : (
                  <p className="text-gray-500 text-sm">
                    {searchTerm 
                      ? `No skills found matching "${searchTerm}" in this category`
                      : 'All skills in this category have been selected'
                    }
                  </p>
                )}
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Skill Level Modal */}
      {showLevelSelector && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <Card className="w-full max-w-md">
            <CardHeader>
              <CardTitle>Select Your Level</CardTitle>
              <CardDescription>
                How would you rate your skill level in <strong>{showLevelSelector}</strong>?
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              {[
                { level: 'beginner' as const, desc: 'Just starting out, basic knowledge' },
                { level: 'intermediate' as const, desc: 'Some experience, can work independently' },
                { level: 'advanced' as const, desc: 'Strong skills, can mentor others' },
                { level: 'expert' as const, desc: 'Deep expertise, recognized authority' }
              ].map(({ level, desc }) => (
                <Button
                  key={level}
                  variant="outline"
                  className="w-full justify-start text-left h-auto p-4"
                  onClick={() => confirmSkill(showLevelSelector, level)}
                >
                  <div>
                    <div className="font-medium capitalize">{level}</div>
                    <div className="text-sm text-gray-500">{desc}</div>
                  </div>
                </Button>
              ))}
              <Button
                variant="ghost"
                className="w-full"
                onClick={() => setShowLevelSelector(null)}
              >
                Cancel
              </Button>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}
