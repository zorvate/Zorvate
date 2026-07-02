"use client";

import { useEffect, useState, useCallback } from "react";
import { Trash2, Edit2, Plus, Copy, Coins, Grid } from "lucide-react";

import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  PricingPlan,
  PricingFeature,
  PricingComparison
} from "@/lib/supabase/pricing";
import {
  getAllPlansAdminAction,
  getComparisonsAction,
  savePlanAction,
  deletePlanAction,
  saveFeatureAction,
  deleteFeatureAction,
  saveComparisonAction,
  deleteComparisonAction
} from "@/lib/backend/actions/pricing-actions";

export default function AdminPricingDashboard() {
  const [plans, setPlans] = useState<PricingPlan[]>([]);
  const [comparisons, setComparisons] = useState<PricingComparison[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<"plans" | "comparisons">("plans");

  // Plan Edit states
  const [editingPlan, setEditingPlan] = useState<Partial<PricingPlan> | null>(null);
  const [selectedPlanId, setSelectedPlanId] = useState<string | null>(null);

  // Feature Edit states
  const [editingFeature, setEditingFeature] = useState<Partial<PricingFeature> | null>(null);

  // Comparison Edit states
  const [editingComp, setEditingComp] = useState<Partial<PricingComparison> | null>(null);

  const loadAllData = useCallback(async () => {
    setLoading(true);
    try {
      const plansRes = await getAllPlansAdminAction();
      const compsRes = await getComparisonsAction();
      if (plansRes.success) {
        setPlans(plansRes.data);
        if (plansRes.data.length > 0 && !selectedPlanId) {
          setSelectedPlanId(plansRes.data[0].id);
        }
      }
      if (compsRes.success) {
        setComparisons(compsRes.data);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  }, [selectedPlanId]);

  useEffect(() => {
    loadAllData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // PLAN CRUD
  const handleSavePlanSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingPlan) return;

    try {
      const payload: Partial<PricingPlan> = {
        ...editingPlan,
        slug: editingPlan.slug || editingPlan.name?.toLowerCase().replace(/\s+/g, "-") || "plan-slug",
        price: Number(editingPlan.price || 0),
        display_order: Number(editingPlan.display_order || 0),
      };

      const res = await savePlanAction(payload);
      if (!res.success) throw new Error(res.error);
      setEditingPlan(null);
      await loadAllData();
    } catch (err) {
      alert(`Error saving plan: ${err instanceof Error ? err.message : String(err)}`);
    }
  };

  const handleDuplicatePlan = async (plan: PricingPlan) => {
    try {
      const duplicate: Partial<PricingPlan> = {
        name: `${plan.name} (Copy)`,
        slug: `${plan.slug}-copy`,
        description: plan.description,
        price: plan.price,
        currency: plan.currency,
        billing_label: plan.billing_label,
        gradient: plan.gradient,
        badge: plan.badge,
        button_text: plan.button_text,
        button_url: plan.button_url,
        is_popular: false,
        display_order: plan.display_order + 1,
        is_active: plan.is_active,
      };

      const res = await savePlanAction(duplicate);
      if (!res.success) throw new Error(res.error);
      await loadAllData();
    } catch (err) {
      alert(`Error duplicating plan: ${err instanceof Error ? err.message : String(err)}`);
    }
  };

  const handleDeletePlan = async (id: string) => {
    if (!confirm("Delete this plan? All features referencing this plan will be cascading deleted.")) return;

    try {
      const res = await deletePlanAction(id);
      if (!res.success) throw new Error(res.error);
      if (selectedPlanId === id) {
        setSelectedPlanId(null);
      }
      await loadAllData();
    } catch (err) {
      alert(`Error deleting plan: ${err instanceof Error ? err.message : String(err)}`);
    }
  };

  // FEATURE CRUD
  const handleSaveFeatureSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingFeature || !selectedPlanId) return;

    try {
      const payload: Partial<PricingFeature> = {
        ...editingFeature,
        plan_id: selectedPlanId,
        display_order: Number(editingFeature.display_order || 0),
      };

      const res = await saveFeatureAction(payload);
      if (!res.success) throw new Error(res.error);
      setEditingFeature(null);
      await loadAllData();
    } catch (err) {
      alert(`Error saving feature: ${err instanceof Error ? err.message : String(err)}`);
    }
  };

  const handleDeleteFeature = async (id: string) => {
    if (!confirm("Delete this feature?")) return;
    try {
      const res = await deleteFeatureAction(id);
      if (!res.success) throw new Error(res.error);
      await loadAllData();
    } catch (err) {
      alert(`Error deleting feature: ${err instanceof Error ? err.message : String(err)}`);
    }
  };

  // COMPARISON CRUD
  const handleSaveComparisonSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingComp) return;

    try {
      const payload: Partial<PricingComparison> = {
        ...editingComp,
        display_order: Number(editingComp.display_order || 0),
      };

      const res = await saveComparisonAction(payload);
      if (!res.success) throw new Error(res.error);
      setEditingComp(null);
      await loadAllData();
    } catch (err) {
      alert(`Error saving comparison: ${err instanceof Error ? err.message : String(err)}`);
    }
  };

  const handleDeleteComparison = async (id: string) => {
    if (!confirm("Delete this comparison row?")) return;
    try {
      const res = await deleteComparisonAction(id);
      if (!res.success) throw new Error(res.error);
      await loadAllData();
    } catch (err) {
      alert(`Error deleting comparison: ${err instanceof Error ? err.message : String(err)}`);
    }
  };

  const selectedPlan = plans.find((p) => p.id === selectedPlanId);

  return (
    <div className="space-y-8 text-foreground select-none">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight">Pricing Control Desk</h1>
          <p className="text-muted-foreground text-sm mt-1">
            Manage plans, configure feature comparison spreadsheets, and toggle visibility.
          </p>
        </div>

        <div className="flex gap-2.5">
          <Button
            onClick={() => setActiveTab("plans")}
            variant={activeTab === "plans" ? "default" : "outline"}
            className="flex items-center gap-1.5 h-10 px-4 text-xs font-bold"
          >
            <Coins size={14} /> Plans & Features
          </Button>
          <Button
            onClick={() => setActiveTab("comparisons")}
            variant={activeTab === "comparisons" ? "default" : "outline"}
            className="flex items-center gap-1.5 h-10 px-4 text-xs font-bold"
          >
            <Grid size={14} /> Comparisons
          </Button>
        </div>
      </div>

      {loading ? (
        <div className="text-center py-12 text-sm text-muted-foreground font-mono">Synchronizing Pricing database...</div>
      ) : activeTab === "plans" ? (
        <div className="grid lg:grid-cols-3 gap-8">
          
          {/* Plan Catalog Column (2/3 size) */}
          <div className="lg:col-span-2 space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-bold tracking-tight">Active Sprints Packages</h2>
              <Button
                onClick={() => setEditingPlan({ is_active: true, is_popular: false })}
                size="sm"
                className="flex items-center gap-1 h-8 text-xs font-bold"
              >
                <Plus size={13} /> Create Package
              </Button>
            </div>

            <div className="space-y-4">
              {plans.map((p) => (
                <div
                  key={p.id}
                  className={`p-5 border rounded-2xl bg-card flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 transition-all ${
                    selectedPlanId === p.id ? "ring-2 ring-primary border-transparent" : "border-border/60"
                  }`}
                >
                  <div className="cursor-pointer flex-grow" onClick={() => setSelectedPlanId(p.id)}>
                    <div className="flex items-center gap-2">
                      <h3 className="font-bold text-base">{p.name}</h3>
                      {p.is_popular && (
                        <span className="text-[8px] bg-primary/10 text-primary border border-primary/20 px-2 py-0.5 rounded-full font-bold uppercase">
                          Popular
                        </span>
                      )}
                      {!p.is_active && (
                        <span className="text-[8px] bg-muted/80 text-muted-foreground px-2 py-0.5 rounded-full font-bold uppercase">
                          Hidden
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-muted-foreground mt-1 max-w-sm truncate">{p.description}</p>
                    <div className="mt-2 text-xs font-bold text-primary">
                      ${p.price} / {p.currency}
                    </div>
                  </div>

                  <div className="flex gap-2 self-end sm:self-center">
                    <Button
                      onClick={() => handleDuplicatePlan(p)}
                      variant="outline"
                      size="sm"
                      title="Duplicate package"
                      className="h-8 w-8 p-0"
                    >
                      <Copy size={13} />
                    </Button>
                    <Button
                      onClick={() => setEditingPlan(p)}
                      variant="outline"
                      size="sm"
                      title="Edit package"
                      className="h-8 w-8 p-0"
                    >
                      <Edit2 size={13} />
                    </Button>
                    <Button
                      onClick={() => handleDeletePlan(p.id)}
                      variant="outline"
                      size="sm"
                      title="Delete package"
                      className="h-8 w-8 p-0 text-destructive hover:bg-destructive/10 border-destructive/20"
                    >
                      <Trash2 size={13} />
                    </Button>
                  </div>
                </div>
              ))}
            </div>

            {/* NESTED PLAN FEATURES */}
            {selectedPlan && (
              <div className="mt-8 border-t border-border/40 pt-8 space-y-6">
                <div className="flex justify-between items-center">
                  <div>
                    <h2 className="text-lg font-bold tracking-tight">
                      Features for: <span className="text-primary">{selectedPlan.name}</span>
                    </h2>
                    <p className="text-xs text-muted-foreground mt-0.5">
                      Configure checklists specifically mapped to this package.
                    </p>
                  </div>
                  <Button
                    onClick={() => setEditingFeature({ enabled: true, plan_id: selectedPlan.id })}
                    size="sm"
                    className="flex items-center gap-1 h-8 text-xs font-bold"
                  >
                    <Plus size={13} /> Add Feature
                  </Button>
                </div>

                <div className="border border-border/80 rounded-2xl bg-card overflow-hidden divide-y divide-border/60">
                  {selectedPlan.features && selectedPlan.features.length > 0 ? (
                    selectedPlan.features.map((f) => (
                      <div key={f.id} className="p-4 flex justify-between items-center hover:bg-white/5 transition-colors">
                        <div className="flex items-center gap-2">
                          <span className={`w-2.5 h-2.5 rounded-full ${f.enabled ? "bg-emerald-500" : "bg-muted"}`} />
                          <span className={`text-xs font-semibold ${f.enabled ? "text-foreground" : "text-muted-foreground line-through"}`}>
                            {f.feature}
                          </span>
                        </div>
                        <div className="flex gap-2">
                          <Button
                            onClick={() => setEditingFeature(f)}
                            variant="outline"
                            size="sm"
                            className="h-7 w-7 p-0"
                          >
                            <Edit2 size={12} />
                          </Button>
                          <Button
                            onClick={() => handleDeleteFeature(f.id)}
                            variant="outline"
                            size="sm"
                            className="h-7 w-7 p-0 text-destructive hover:bg-destructive/10 border-destructive/20"
                          >
                            <Trash2 size={12} />
                          </Button>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="p-8 text-center text-xs text-muted-foreground font-semibold">
                      No features created for this package yet.
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* CMS Dialog / Sidebar Editors (1/3 size) */}
          <div className="space-y-6">
            {editingPlan && (
              <Card className="border bg-card">
                <CardHeader>
                  <CardTitle className="text-sm font-bold">
                    {editingPlan.id ? "Edit Plan Metadata" : "Create Plan Package"}
                  </CardTitle>
                  <CardDescription className="text-xs">
                    Configure pricing constants, visual styles, and CTA paths.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleSavePlanSubmit} className="space-y-4 text-xs font-semibold">
                    <div className="space-y-1">
                      <Label htmlFor="name">Plan Name</Label>
                      <Input
                        id="name"
                        value={editingPlan.name || ""}
                        onChange={(e) => setEditingPlan({ ...editingPlan, name: e.target.value })}
                        required
                      />
                    </div>

                    <div className="space-y-1">
                      <Label htmlFor="slug">Plan Slug</Label>
                      <Input
                        id="slug"
                        placeholder="e.g. starter"
                        value={editingPlan.slug || ""}
                        onChange={(e) => setEditingPlan({ ...editingPlan, slug: e.target.value })}
                      />
                    </div>

                    <div className="space-y-1">
                      <Label htmlFor="desc">Plan Description</Label>
                      <textarea
                        id="desc"
                        rows={2}
                        className="w-full border border-input rounded-md px-3 py-2 text-xs bg-transparent"
                        value={editingPlan.description || ""}
                        onChange={(e) => setEditingPlan({ ...editingPlan, description: e.target.value })}
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div className="space-y-1">
                        <Label htmlFor="price">Price ($)</Label>
                        <Input
                          id="price"
                          type="number"
                          value={editingPlan.price || 0}
                          onChange={(e) => setEditingPlan({ ...editingPlan, price: Number(e.target.value) })}
                        />
                      </div>
                      <div className="space-y-1">
                        <Label htmlFor="billing_label">Billing Label</Label>
                        <Input
                          id="billing_label"
                          placeholder="e.g. Starting From"
                          value={editingPlan.billing_label || ""}
                          onChange={(e) => setEditingPlan({ ...editingPlan, billing_label: e.target.value })}
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div className="space-y-1">
                        <Label htmlFor="gradient">Gradient Color</Label>
                        <select
                          id="gradient"
                          className="w-full border border-input rounded-md h-9 px-2 bg-transparent"
                          value={editingPlan.gradient || "indigo"}
                          onChange={(e) => setEditingPlan({ ...editingPlan, gradient: e.target.value })}
                        >
                          <option value="indigo">Indigo</option>
                          <option value="accent">Accent</option>
                          <option value="violet">Violet</option>
                          <option value="emerald">Emerald</option>
                        </select>
                      </div>
                      <div className="space-y-1">
                        <Label htmlFor="badge">Badge Label</Label>
                        <Input
                          id="badge"
                          placeholder="e.g. Most Popular"
                          value={editingPlan.badge || ""}
                          onChange={(e) => setEditingPlan({ ...editingPlan, badge: e.target.value })}
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div className="space-y-1">
                        <Label htmlFor="button_text">Button Text</Label>
                        <Input
                          id="button_text"
                          value={editingPlan.button_text || ""}
                          onChange={(e) => setEditingPlan({ ...editingPlan, button_text: e.target.value })}
                        />
                      </div>
                      <div className="space-y-1">
                        <Label htmlFor="button_url">Button URL</Label>
                        <Input
                          id="button_url"
                          value={editingPlan.button_url || ""}
                          onChange={(e) => setEditingPlan({ ...editingPlan, button_url: e.target.value })}
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div className="space-y-1">
                        <Label htmlFor="display_order">Display Weight</Label>
                        <Input
                          id="display_order"
                          type="number"
                          value={editingPlan.display_order || 0}
                          onChange={(e) => setEditingPlan({ ...editingPlan, display_order: Number(e.target.value) })}
                        />
                      </div>
                      <div className="space-y-1 flex flex-col justify-end gap-1.5 pb-2">
                        <div className="flex items-center gap-1.5">
                          <input
                            type="checkbox"
                            id="is_active"
                            checked={editingPlan.is_active !== false}
                            onChange={(e) => setEditingPlan({ ...editingPlan, is_active: e.target.checked })}
                          />
                          <Label htmlFor="is_active">Publish (Active)</Label>
                        </div>
                        <div className="flex items-center gap-1.5">
                          <input
                            type="checkbox"
                            id="is_popular"
                            checked={editingPlan.is_popular === true}
                            onChange={(e) => setEditingPlan({ ...editingPlan, is_popular: e.target.checked })}
                          />
                          <Label htmlFor="is_popular">Popular Tag</Label>
                        </div>
                      </div>
                    </div>

                    <div className="flex gap-2 pt-2">
                      <Button type="submit" className="flex-grow">
                        Save Plan
                      </Button>
                      <Button type="button" variant="outline" onClick={() => setEditingPlan(null)}>
                        Cancel
                      </Button>
                    </div>
                  </form>
                </CardContent>
              </Card>
            )}

            {editingFeature && (
              <Card className="border bg-card">
                <CardHeader>
                  <CardTitle className="text-sm font-bold">
                    {editingFeature.id ? "Edit Feature" : "Add Plan Feature"}
                  </CardTitle>
                  <CardDescription className="text-xs">
                    Define a single row item checklist for the package features layout.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleSaveFeatureSubmit} className="space-y-4 text-xs font-semibold">
                    <div className="space-y-1">
                      <Label htmlFor="feature">Feature Text</Label>
                      <Input
                        id="feature"
                        value={editingFeature.feature || ""}
                        onChange={(e) => setEditingFeature({ ...editingFeature, feature: e.target.value })}
                        required
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div className="space-y-1">
                        <Label htmlFor="feat_order">Display Order</Label>
                        <Input
                          id="feat_order"
                          type="number"
                          value={editingFeature.display_order || 0}
                          onChange={(e) => setEditingFeature({ ...editingFeature, display_order: Number(e.target.value) })}
                        />
                      </div>
                      <div className="space-y-1 flex items-center gap-2 pt-5">
                        <input
                          type="checkbox"
                          id="feat_enabled"
                          checked={editingFeature.enabled !== false}
                          onChange={(e) => setEditingFeature({ ...editingFeature, enabled: e.target.checked })}
                        />
                        <Label htmlFor="feat_enabled">Enabled</Label>
                      </div>
                    </div>

                    <div className="flex gap-2 pt-2">
                      <Button type="submit" className="flex-grow">
                        Save Feature
                      </Button>
                      <Button type="button" variant="outline" onClick={() => setEditingFeature(null)}>
                        Cancel
                      </Button>
                    </div>
                  </form>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      ) : (
        /* COMPARISONS SPREADSHEET VIEW */
        <div className="grid lg:grid-cols-3 gap-8">
          
          <div className="lg:col-span-2 space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-bold tracking-tight">Comparisons Matrix Sheet</h2>
              <Button
                onClick={() => setEditingComp({ starter: "cross", business: "cross", web_app: "cross", ai: "cross" })}
                size="sm"
                className="flex items-center gap-1 h-8 text-xs font-bold"
              >
                <Plus size={13} /> Append Capability Row
              </Button>
            </div>

            <div className="overflow-x-auto border border-border/85 rounded-2xl bg-card">
              <table className="w-full text-left border-collapse text-xs font-semibold">
                <thead>
                  <tr className="border-b border-border/60 bg-white/5">
                    <th className="p-3 text-muted-foreground">Row Feature</th>
                    <th className="p-3 text-center">Starter</th>
                    <th className="p-3 text-center">Business</th>
                    <th className="p-3 text-center">Web App</th>
                    <th className="p-3 text-center">AI</th>
                    <th className="p-3 text-center">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border/60">
                  {comparisons.map((row) => (
                    <tr key={row.id} className="hover:bg-white/5 transition-colors">
                      <td className="p-3 font-bold text-foreground">{row.feature_name}</td>
                      <td className="p-3 text-center truncate max-w-[100px]">{row.starter}</td>
                      <td className="p-3 text-center truncate max-w-[100px]">{row.business}</td>
                      <td className="p-3 text-center truncate max-w-[100px]">{row.web_app}</td>
                      <td className="p-3 text-center truncate max-w-[100px]">{row.ai}</td>
                      <td className="p-3 text-center">
                        <div className="flex gap-1 justify-center">
                          <Button onClick={() => setEditingComp(row)} variant="outline" size="sm" className="h-7 w-7 p-0">
                            <Edit2 size={12} />
                          </Button>
                          <Button onClick={() => handleDeleteComparison(row.id)} variant="outline" size="sm" className="h-7 w-7 p-0 text-destructive hover:bg-destructive/10 border-destructive/20">
                            <Trash2 size={12} />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <div className="space-y-6">
            {editingComp && (
              <Card className="border bg-card">
                <CardHeader>
                  <CardTitle className="text-sm font-bold">
                    {editingComp.id ? "Edit Matrix Row" : "Add Matrix Row"}
                  </CardTitle>
                  <CardDescription className="text-xs">
                    Define cell values (e.g. &apos;check&apos;, &apos;cross&apos;, or custom description).
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleSaveComparisonSubmit} className="space-y-4 text-xs font-semibold">
                    <div className="space-y-1">
                      <Label htmlFor="comp_name">Feature Capability Name</Label>
                      <Input
                        id="comp_name"
                        placeholder="e.g. Supabase Auth"
                        value={editingComp.feature_name || ""}
                        onChange={(e) => setEditingComp({ ...editingComp, feature_name: e.target.value })}
                        required
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div className="space-y-1">
                        <Label htmlFor="starter_cell">Starter Cell</Label>
                        <Input
                          id="starter_cell"
                          placeholder="check or cross or text"
                          value={editingComp.starter || ""}
                          onChange={(e) => setEditingComp({ ...editingComp, starter: e.target.value })}
                        />
                      </div>
                      <div className="space-y-1">
                        <Label htmlFor="business_cell">Business Cell</Label>
                        <Input
                          id="business_cell"
                          placeholder="check or cross or text"
                          value={editingComp.business || ""}
                          onChange={(e) => setEditingComp({ ...editingComp, business: e.target.value })}
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div className="space-y-1">
                        <Label htmlFor="webapp_cell">Web App Cell</Label>
                        <Input
                          id="webapp_cell"
                          placeholder="check or cross or text"
                          value={editingComp.web_app || ""}
                          onChange={(e) => setEditingComp({ ...editingComp, web_app: e.target.value })}
                        />
                      </div>
                      <div className="space-y-1">
                        <Label htmlFor="ai_cell">AI Cell</Label>
                        <Input
                          id="ai_cell"
                          placeholder="check or cross or text"
                          value={editingComp.ai || ""}
                          onChange={(e) => setEditingComp({ ...editingComp, ai: e.target.value })}
                        />
                      </div>
                    </div>

                    <div className="space-y-1">
                      <Label htmlFor="comp_order">Display Weight (Sort Order)</Label>
                      <Input
                        id="comp_order"
                        type="number"
                        value={editingComp.display_order || 0}
                        onChange={(e) => setEditingComp({ ...editingComp, display_order: Number(e.target.value) })}
                      />
                    </div>

                    <div className="flex gap-2 pt-2">
                      <Button type="submit" className="flex-grow">
                        Save Matrix Row
                      </Button>
                      <Button type="button" variant="outline" onClick={() => setEditingComp(null)}>
                        Cancel
                      </Button>
                    </div>
                  </form>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
