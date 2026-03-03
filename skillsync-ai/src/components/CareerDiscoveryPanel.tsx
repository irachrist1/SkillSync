"use client";

import { Compass, Link2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import type { AssessmentProfile, MatchResult, RiasecKey } from "@/lib/types/assessment";

interface CareerDiscoveryPanelProps {
  profile: AssessmentProfile | null;
  matches: MatchResult[];
  onViewRelatedJobs: (sector: string) => void;
  onRetakeAssessment: () => void;
}

const riasecLabels: Record<RiasecKey, string> = {
  realistic: "Realistic",
  investigative: "Investigative",
  artistic: "Artistic",
  social: "Social",
  enterprising: "Enterprising",
  conventional: "Conventional",
};

export function CareerDiscoveryPanel({
  profile,
  matches,
  onViewRelatedJobs,
  onRetakeAssessment,
}: CareerDiscoveryPanelProps) {
  if (!profile) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Compass className="w-5 h-5 text-blue-600" />
            Career Discovery
          </CardTitle>
          <CardDescription>
            You skipped Discover this time. Take the assessment to unlock interest-based matches.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Button onClick={onRetakeAssessment}>Take Discover Assessment</Button>
        </CardContent>
      </Card>
    );
  }

  const maxRiasec = Math.max(...Object.values(profile.riasec), 1);

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>RIASEC Profile</CardTitle>
          <CardDescription>Your strongest interest dimensions from the discover assessment.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          {(Object.entries(profile.riasec) as Array<[RiasecKey, number]>).map(([key, value]) => (
            <div key={key}>
              <div className="flex items-center justify-between mb-1 text-sm">
                <span className="font-medium text-gray-700">{riasecLabels[key]}</span>
                <span className="text-gray-500">{value}</span>
              </div>
              <div className="h-2 rounded-full bg-gray-100 overflow-hidden">
                <div className="h-full bg-blue-600" style={{ width: `${Math.round((value / maxRiasec) * 100)}%` }} />
              </div>
            </div>
          ))}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Top Career Matches</CardTitle>
          <CardDescription>Matches based on interests, values, personality, and work environment.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          {matches.length === 0 && (
            <p className="text-sm text-gray-600">No career matches yet. Complete Discover to generate recommendations.</p>
          )}

          {matches.map((match) => (
            <div key={match.careerId} className="rounded-md border p-4 space-y-2">
              <div className="flex items-center justify-between gap-3">
                <div>
                  <h3 className="font-semibold text-gray-900">{match.careerTitle}</h3>
                  <p className="text-xs text-gray-500">{match.sector}</p>
                </div>
                <div className="text-lg font-bold text-blue-700">{match.matchScore}%</div>
              </div>
              <p className="text-sm text-gray-700">{match.reasoning}</p>
              <div className="text-xs text-gray-500">
                Interest {match.breakdown.interestScore}% • Values {match.breakdown.valueScore}% • Personality {match.breakdown.personalityScore}% • Environment {match.breakdown.environmentScore}%
              </div>
              <Button variant="outline" size="sm" onClick={() => onViewRelatedJobs(match.sector)}>
                <Link2 className="w-4 h-4 mr-2" />
                View Related Jobs
              </Button>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}
