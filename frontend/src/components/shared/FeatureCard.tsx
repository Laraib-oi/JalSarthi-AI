"use client";

import { motion } from "framer-motion";
import {
  BarChart3,
  FileText,
  Landmark,
  Mic,
  ShieldCheck,
  Sparkles,
  type LucideIcon,
} from "lucide-react";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import type { FeatureIconName, FeatureItem } from "@/types";

/**
 * Maps the serializable `FeatureIconName` key (defined in `src/types`) to
 * an actual Lucide icon component. This map — and the component references
 * it holds — lives entirely within this Client Component, so it never has
 * to cross the Server → Client boundary as prop data.
 */
const ICONS: Record<FeatureIconName, LucideIcon> = {
  "ai-assistant": Sparkles,
  "government-knowledge": Landmark,
  "complaint-generator": FileText,
  "voice-assistant": Mic,
  "officer-copilot": ShieldCheck,
  "analytics-dashboard": BarChart3,
};

interface FeatureCardProps {
  feature: FeatureItem;
  index: number;
}

export function FeatureCard({ feature, index }: FeatureCardProps) {
  const Icon = ICONS[feature.icon];

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.5, delay: index * 0.06, ease: [0.16, 1, 0.3, 1] }}
      className="group h-full"
    >
      <Card className="h-full transition-all duration-300 ease-out group-hover:-translate-y-1.5 group-hover:border-primary-200 group-hover:shadow-card-hover">
        <CardHeader>
          <div className="mb-2 flex items-center justify-between">
            <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary-50 text-primary-600 transition-colors duration-300 group-hover:bg-gradient-primary group-hover:text-white">
              <Icon className="h-6 w-6" strokeWidth={2} aria-hidden="true" />
            </span>
            {feature.status === "upcoming" && (
              <span className="rounded-full border border-border bg-surface px-2.5 py-1 text-caption font-medium text-ink-muted">
                Coming soon
              </span>
            )}
          </div>
          <CardTitle>{feature.title}</CardTitle>
        </CardHeader>
        <CardContent>
          <CardDescription>{feature.description}</CardDescription>
        </CardContent>
      </Card>
    </motion.div>
  );
}
