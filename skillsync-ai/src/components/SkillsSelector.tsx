'use client';

import React, { useState, useMemo } from 'react';
import { Plus, X } from 'lucide-react';
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
  const searchTerm = '';
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
      <div className="text-center mb-8">
        <div className="flex justify-center mb-4">
          <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl flex items-center justify-center">
            <Plus className="w-6 h-6 text-white" />
          </div>
        </div>
        <h2 className="text-3xl font-bold text-gray-900 mb-3">
          Select Your Skills
        </h2>
        <p className="text-gray-600 text-lg max-w-2xl mx-auto">
          Choose skills you already have. We'll analyze Rwanda job opportunities and show you exactly what you can achieve.
        </p>
      </div>

      {/* Selected Skills */}
      {selectedSkills.length > 0 && (
        <Card className="bg-gradient-to-br from-blue-50 to-indigo-50 border-blue-200">
          <CardHeader className="pb-4">
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg flex items-center gap-2">
                <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
                Your Skills ({selectedSkills.length})
              </CardTitle>
              <div className="text-sm text-blue-600 font-medium">
                Ready for analysis
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-3">
              {selectedSkills.map((skill) => (
                <div
                  key={skill.id}
                  className="group flex items-center gap-2 bg-white/80 backdrop-blur-sm border border-white/50 rounded-xl py-2 px-4 shadow-sm hover:shadow-md transition-all duration-200 hover:scale-105"
                >
                  <span className="font-medium text-gray-900">{skill.name}</span>
                  <span className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded-full">
                    {skill.level}
                  </span>
                  <button
                    onClick={() => removeSkill(skill.id)}
                    className="ml-1 hover:bg-red-100 rounded-full p-1 transition-colors opacity-60 group-hover:opacity-100"
                  >
                    <X className="w-3 h-3 text-red-600" />
                  </button>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Filter */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="flex gap-2 overflow-x-auto pb-2">
          <Button
            variant={selectedCategory === 'all' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setSelectedCategory('all')}
            className="rounded-full transition-all duration-200 hover:scale-105"
          >
            All Skills
          </Button>
          {RWANDA_SKILL_CATEGORIES.map((category) => (
            <Button
              key={category.id}
              variant={selectedCategory === category.id ? 'default' : 'outline'}
              size="sm"
              onClick={() => setSelectedCategory(category.id)}
              className="whitespace-nowrap rounded-full transition-all duration-200 hover:scale-105"
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
            <Card key={category.id} className="relative hover:shadow-lg transition-all duration-300 border-l-4 border-l-blue-500">
              <CardHeader className="pb-4">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <CardTitle className="text-xl text-gray-900 mb-2 flex items-center gap-2">
                      <span className="text-2xl">{demand.symbol}</span>
                      {category.name}
                    </CardTitle>
                    <CardDescription className="text-base text-gray-600">
                      {category.description}
                    </CardDescription>
                  </div>
                  <div className="text-right ml-4">
                    <div className={cn("text-sm font-semibold px-3 py-1 rounded-full", demand.color === 'text-green-600' ? 'bg-green-100 text-green-700' : demand.color === 'text-blue-600' ? 'bg-blue-100 text-blue-700' : demand.color === 'text-yellow-600' ? 'bg-yellow-100 text-yellow-700' : 'bg-gray-100 text-gray-700')}>
                      {demand.text}
                    </div>
                    <div className="text-sm text-gray-600 mt-2 font-medium">
                      +{(category.avgSalaryImpact / 1000).toFixed(0)}k RWF avg impact
                    </div>
                  </div>
                </div>
              </CardHeader>
              
              <CardContent>
                {availableSkills.length > 0 ? (
                  <div className="flex flex-wrap gap-3">
                    {availableSkills.map((skillName) => (
                      <button
                        key={skillName}
                        onClick={() => addSkill(skillName)}
                        className="group inline-flex items-center gap-2 px-4 py-2.5 text-sm bg-gradient-to-r from-gray-50 to-gray-100 hover:from-blue-50 hover:to-indigo-50 border border-gray-200 hover:border-blue-300 rounded-xl transition-all duration-200 hover:scale-105 hover:shadow-sm"
                      >
                        <Plus className="w-4 h-4 text-gray-400 group-hover:text-blue-500 transition-colors" />
                        <span className="font-medium text-gray-700 group-hover:text-gray-900">
                          {skillName}
                        </span>
                      </button>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <div className="text-gray-400 text-4xl mb-2">✨</div>
                    <p className="text-gray-500 text-sm">
                      {searchTerm 
                        ? `No skills found matching "${searchTerm}" in this category`
                        : 'All skills in this category have been selected'
                      }
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Skill Level Modal */}
      {showLevelSelector && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50 animate-in fade-in duration-200">
          <Card className="w-full max-w-md mx-auto scale-100 animate-in zoom-in-95 duration-200 shadow-2xl border-2 border-white/20">
            <CardHeader className="text-center pb-6">
              <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <Plus className="w-8 h-8 text-white" />
              </div>
              <CardTitle className="text-2xl">Select Your Level</CardTitle>
              <CardDescription className="text-base">
                How would you rate your skill level in <strong className="text-blue-600">{showLevelSelector}</strong>?
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3 pb-6">
              {[
                { level: 'beginner' as const, desc: 'Just starting out, basic knowledge', color: 'from-green-50 to-emerald-50 border-green-200 hover:border-green-300' },
                { level: 'intermediate' as const, desc: 'Some experience, can work independently', color: 'from-blue-50 to-cyan-50 border-blue-200 hover:border-blue-300' },
                { level: 'advanced' as const, desc: 'Strong skills, can mentor others', color: 'from-purple-50 to-violet-50 border-purple-200 hover:border-purple-300' },
                { level: 'expert' as const, desc: 'Deep expertise, recognized authority', color: 'from-orange-50 to-red-50 border-orange-200 hover:border-orange-300' }
              ].map(({ level, desc, color }) => (
                <button
                  key={level}
                  className={`w-full p-4 text-left rounded-xl border-2 bg-gradient-to-r ${color} transition-all duration-200 hover:scale-105 hover:shadow-md group`}
                  onClick={() => confirmSkill(showLevelSelector, level)}
                >
                  <div>
                    <div className="font-semibold capitalize text-gray-900 text-lg mb-1 group-hover:text-gray-800">
                      {level}
                    </div>
                    <div className="text-sm text-gray-600 group-hover:text-gray-700">
                      {desc}
                    </div>
                  </div>
                </button>
              ))}
              <div className="pt-4 border-t border-gray-200">
                <Button
                  variant="ghost"
                  className="w-full hover:bg-gray-100 transition-colors"
                  onClick={() => setShowLevelSelector(null)}
                >
                  Cancel
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}
