"use client";

import { useEffect, useState } from "react";
import { Save, Coins, Info, Share2, HelpCircle, Star, Plus, Trash2, LayoutGrid, Search, Compass, Anchor, Briefcase, Users } from "lucide-react";
import {
  saveFaqAction,
  deleteFaqAction,
  saveTestimonialAction,
  deleteTestimonialAction,
  saveSiteSettingAction,
  getRawSiteSettingsAction,
  getFaqsAction,
  getTestimonialsAction,
  listServicesAction,
  listTeamMembersAction,
  saveServiceAction,
  updateServiceAction,
  deleteServiceAction,
  saveTeamMemberAction,
  updateTeamMemberAction,
  deleteTeamMemberAction
} from "@/lib/backend/actions/cms-actions";
import { SiteSetting, Faq, Testimonial, Service, TeamMember } from "@/lib/supabase/cms";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

export default function AdminSettingsPage() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [activeTab, setActiveTab] = useState<"metrics" | "company" | "socials" | "hero" | "seo" | "navlinks" | "footerlinks" | "faqs" | "testimonials" | "services" | "team">("metrics");
  const [settings, setSettings] = useState<SiteSetting[]>([]);
  const [faqs, setFaqs] = useState<Faq[]>([]);
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [services, setServices] = useState<Service[]>([]);
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>([]);

  // Navigation and footer dynamic link list states
  const [navLinks, setNavLinks] = useState<{ title: string; href: string }[]>([]);
  const [footerLinks, setFooterLinks] = useState<{ title: string; href: string }[]>([]);

  // FAQ modal/editing states
  const [editingFaq, setEditingFaq] = useState<Partial<Faq> | null>(null);
  
  // Testimonial modal/editing states
  const [editingTestimonial, setEditingTestimonial] = useState<Partial<Testimonial> | null>(null);

  // Service & Team editing states
  const [editingService, setEditingService] = useState<Partial<Service> | null>(null);
  const [editingTeam, setEditingTeam] = useState<Partial<TeamMember> | null>(null);

  const normalizeServiceRecord = (service: Service | Record<string, unknown>): Service => {
    const record = service as Record<string, unknown>;
    const shortDescription = typeof record.shortDescription === "string"
      ? record.shortDescription
      : typeof record.short_description === "string"
      ? record.short_description
      : "";

    return {
      ...service,
      shortDescription,
    } as Service;
  };

  useEffect(() => {
    async function loadData() {
      setLoading(true);
      try {
        const settingsRes = await getRawSiteSettingsAction();
        const faqsRes = await getFaqsAction();
        const testimonialsRes = await getTestimonialsAction();
        const servicesRes = await listServicesAction();
        const teamRes = await listTeamMembersAction();

        if (settingsRes.success) {
          setSettings(settingsRes.data);
          
          const navSetting = settingsRes.data.find(s => s.key === "navigation_links");
          if (navSetting) {
            try { setNavLinks(JSON.parse(navSetting.value)); } catch {}
          }
          const footerSetting = settingsRes.data.find(s => s.key === "footer_links");
          if (footerSetting) {
            try { setFooterLinks(JSON.parse(footerSetting.value)); } catch {}
          }
        }
        if (faqsRes.success) setFaqs(faqsRes.data);
        if (testimonialsRes.success) setTestimonials(testimonialsRes.data);
        if (servicesRes.success) setServices(servicesRes.data.map(normalizeServiceRecord));
        if (teamRes.success) setTeamMembers(teamRes.data);
      } catch (e) {
        console.error("Error loading settings:", e);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  const refreshFaqs = async () => {
    const res = await getFaqsAction();
    if (res.success) setFaqs(res.data);
  };

  const refreshTestimonials = async () => {
    const res = await getTestimonialsAction();
    if (res.success) setTestimonials(res.data);
  };

  const refreshServices = async () => {
    const res = await listServicesAction();
    if (res.success) setServices(res.data.map(normalizeServiceRecord));
  };

  const refreshTeam = async () => {
    const res = await listTeamMembersAction();
    if (res.success) setTeamMembers(res.data);
  };

  const handleSettingChange = (key: string, value: string) => {
    setSettings((prev) =>
      prev.map((s) => (s.key === key ? { ...s, value } : s))
    );
  };

  const handleSaveSettings = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      if (activeTab === "navlinks") {
        const res = await saveSiteSettingAction("navigation_links", JSON.stringify(navLinks), "Header Navigation Links");
        if (!res.success) throw new Error(res.error);
        alert("Navigation settings saved successfully!");
        return;
      }

      if (activeTab === "footerlinks") {
        const res = await saveSiteSettingAction("footer_links", JSON.stringify(footerLinks), "Footer Quick Links");
        if (!res.success) throw new Error(res.error);
        alert("Footer settings saved successfully!");
        return;
      }

      const settingsToSave = settings.filter(s => {
        if (activeTab === "metrics") {
          return ["projects_completed", "happy_clients", "solutions_delivered", "years_building", "satisfaction", "projects_delivered", "response_time", "custom_software", "countries_served"].includes(s.key);
        }
        if (activeTab === "company") {
          return ["company_name", "company_email", "company_phone", "company_address", "company_description"].includes(s.key);
        }
        if (activeTab === "socials") {
          return ["social_facebook", "social_twitter", "social_github", "social_linkedin"].includes(s.key);
        }
        if (activeTab === "hero") {
          return ["hero_title", "hero_subtitle", "hero_cta_text"].includes(s.key);
        }
        if (activeTab === "seo") {
          return ["seo_title", "seo_description", "seo_keywords"].includes(s.key);
        }
        return false;
      });

      for (const setting of settingsToSave) {
        const res = await saveSiteSettingAction(setting.key, setting.value, setting.label);
        if (!res.success) throw new Error(res.error);
      }
      alert("Settings saved successfully!");
    } catch (err) {
      alert(`Error saving settings: ${err instanceof Error ? err.message : String(err)}`);
    } finally {
      setSaving(false);
    }
  };

  // FAQ CRUD
  const handleSaveFaqSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingFaq) return;
    try {
      const payload = {
        id: editingFaq.id,
        question: editingFaq.question || "",
        answer: editingFaq.answer || "",
        display_order: Number(editingFaq.display_order || 0),
      };
      const res = await saveFaqAction(payload);
      if (!res.success) throw new Error(res.error);
      setEditingFaq(null);
      await refreshFaqs();
    } catch (err) {
      alert(`Error saving FAQ: ${err instanceof Error ? err.message : String(err)}`);
    }
  };

  const handleDeleteFaq = async (id: string) => {
    if (!confirm("Are you sure you want to delete this FAQ?")) return;
    try {
      const res = await deleteFaqAction(id);
      if (!res.success) throw new Error(res.error);
      await refreshFaqs();
    } catch (err) {
      alert(`Error deleting FAQ: ${err instanceof Error ? err.message : String(err)}`);
    }
  };

  // Testimonial CRUD
  const handleSaveTestimonialSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingTestimonial) return;
    try {
      const payload = {
        id: editingTestimonial.id,
        name: editingTestimonial.name || "",
        role: editingTestimonial.role || "",
        text: editingTestimonial.text || "",
        rating: Number(editingTestimonial.rating || 5),
        display_order: Number(editingTestimonial.display_order || 0),
      };
      const res = await saveTestimonialAction(payload);
      if (!res.success) throw new Error(res.error);
      setEditingTestimonial(null);
      await refreshTestimonials();
    } catch (err) {
      alert(`Error saving testimonial: ${err instanceof Error ? err.message : String(err)}`);
    }
  };

  const handleDeleteTestimonial = async (id: string) => {
    if (!confirm("Are you sure you want to delete this testimonial?")) return;
    try {
      const res = await deleteTestimonialAction(id);
      if (!res.success) throw new Error(res.error);
      await refreshTestimonials();
    } catch (err) {
      alert(`Error deleting testimonial: ${err instanceof Error ? err.message : String(err)}`);
    }
  };

  // Services CRUD
  const handleSaveServiceSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingService) return;
    try {
      const payload = {
        slug: editingService.slug || "",
        title: editingService.title || "",
        short_description: editingService.shortDescription || "",
        description: editingService.description || "",
        features: editingService.features || [],
        display_order: Number(editingService.display_order || 0),
      };
      const res = editingService.id
        ? await updateServiceAction(editingService.id, payload)
        : await saveServiceAction(payload);
      if (!res.success) throw new Error(res.error);
      setEditingService(null);
      await refreshServices();
    } catch (err) {
      alert(`Error saving service: ${err instanceof Error ? err.message : String(err)}`);
    }
  };

  const handleDeleteService = async (id: string) => {
    if (!confirm("Are you sure you want to delete this service?")) return;
    try {
      const res = await deleteServiceAction(id);
      if (!res.success) throw new Error(res.error);
      await refreshServices();
    } catch (err) {
      alert(`Error deleting service: ${err instanceof Error ? err.message : String(err)}`);
    }
  };

  // Team CRUD
  const handleSaveTeamSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingTeam) return;
    try {
      const payload = {
        name: editingTeam.name || "",
        role: editingTeam.role || "",
        image_url: editingTeam.image_url || "",
        display_order: Number(editingTeam.display_order || 0),
      };
      const res = editingTeam.id
        ? await updateTeamMemberAction(editingTeam.id, payload)
        : await saveTeamMemberAction(payload);
      if (!res.success) throw new Error(res.error);
      setEditingTeam(null);
      await refreshTeam();
    } catch (err) {
      alert(`Error saving team member: ${err instanceof Error ? err.message : String(err)}`);
    }
  };

  const handleDeleteTeam = async (id: string) => {
    if (!confirm("Are you sure you want to delete this team member?")) return;
    try {
      const res = await deleteTeamMemberAction(id);
      if (!res.success) throw new Error(res.error);
      await refreshTeam();
    } catch (err) {
      alert(`Error deleting team member: ${err instanceof Error ? err.message : String(err)}`);
    }
  };

  // Links List CRUD Helpers
  const handleAddLink = (type: "nav" | "footer") => {
    const list = type === "nav" ? navLinks : footerLinks;
    const setter = type === "nav" ? setNavLinks : setFooterLinks;
    setter([...list, { title: "New Link", href: "/" }]);
  };

  const handleLinkChange = (type: "nav" | "footer", idx: number, field: "title" | "href", val: string) => {
    const list = type === "nav" ? navLinks : footerLinks;
    const setter = type === "nav" ? setNavLinks : setFooterLinks;
    setter(list.map((link, i) => (i === idx ? { ...link, [field]: val } : link)));
  };

  const handleRemoveLink = (type: "nav" | "footer", idx: number) => {
    const list = type === "nav" ? navLinks : footerLinks;
    const setter = type === "nav" ? setNavLinks : setFooterLinks;
    setter(list.filter((_, i) => i !== idx));
  };

  const renderInputField = (key: string, label: string, type: "text" | "textarea" = "text") => {
    const setting = settings.find((s) => s.key === key);
    if (!setting) return null;

    return (
      <div className="space-y-1.5" key={key}>
        <Label htmlFor={key}>{label}</Label>
        {type === "textarea" ? (
          <Textarea
            id={key}
            rows={4}
            value={setting.value}
            onChange={(e) => handleSettingChange(key, e.target.value)}
            className="w-full mt-1 text-xs"
          />
        ) : (
          <Input
            id={key}
            type="text"
            value={setting.value}
            onChange={(e) => handleSettingChange(key, e.target.value)}
            className="w-full mt-1 text-xs"
          />
        )}
      </div>
    );
  };

  const renderNavLinkEditor = (type: "nav" | "footer") => {
    const list = type === "nav" ? navLinks : footerLinks;
    return (
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <span className="text-xs font-bold text-muted-foreground">Coordinates Menu list</span>
          <Button type="button" onClick={() => handleAddLink(type)} size="sm" className="h-8 text-xs flex items-center gap-1 font-bold">
            <Plus size={12} /> Add Link Row
          </Button>
        </div>
        
        <div className="border border-border/60 rounded-xl overflow-hidden divide-y divide-border/60">
          {list.map((link, idx) => (
            <div key={idx} className="p-3 flex items-center gap-3 bg-card/10 hover:bg-card/25 transition-colors">
              <div className="grid grid-cols-2 gap-3 flex-grow">
                <Input
                  value={link.title}
                  onChange={(e) => handleLinkChange(type, idx, "title", e.target.value)}
                  placeholder="Link Title"
                  className="h-8 text-xs bg-background/50"
                />
                <Input
                  value={link.href}
                  onChange={(e) => handleLinkChange(type, idx, "href", e.target.value)}
                  placeholder="URL Path"
                  className="h-8 text-xs bg-background/50 font-mono"
                />
              </div>
              <Button
                type="button"
                onClick={() => handleRemoveLink(type, idx)}
                variant="outline"
                size="sm"
                className="h-8 w-8 p-0 text-destructive border-destructive/20 hover:bg-destructive/10"
              >
                <Trash2 size={12} />
              </Button>
            </div>
          ))}
          {list.length === 0 && (
            <div className="p-8 text-center text-xs text-muted-foreground italic font-semibold">No link rows configured.</div>
          )}
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-8 text-foreground select-none">
      <div className="flex flex-col xl:flex-row justify-between items-start xl:items-center gap-4">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight">Site Settings Control</h1>
          <p className="text-muted-foreground text-sm mt-1">
            Manage agency branding parameters, home hero, navigation maps, footer coordinate tags, FAQs, testimonials, and dynamic statistics.
          </p>
        </div>

        <div className="flex flex-wrap gap-1 bg-muted/20 p-1 rounded-lg border border-border/40 max-w-full">
          {[
            { id: "metrics", label: "Metrics", icon: Coins },
            { id: "company", label: "Company Info", icon: Info },
            { id: "hero", label: "Hero Copy", icon: LayoutGrid },
            { id: "seo", label: "SEO Config", icon: Search },
            { id: "navlinks", label: "Header Map", icon: Compass },
            { id: "footerlinks", label: "Footer Map", icon: Anchor },
            { id: "socials", label: "Socials", icon: Share2 },
            { id: "faqs", label: "FAQ Desk", icon: HelpCircle },
            { id: "testimonials", label: "Reviews", icon: Star },
            { id: "services", label: "Services CMS", icon: Briefcase },
            { id: "team", label: "Team CMS", icon: Users },
          ].map((tab) => {
            const Icon = tab.icon;
            return (
              <Button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as typeof activeTab)}
                variant={activeTab === tab.id ? "default" : "ghost"}
                className={`flex items-center gap-1.5 h-8 px-3 text-xs font-bold ${
                  activeTab === tab.id ? "" : "text-muted-foreground hover:text-foreground"
                }`}
              >
                <Icon size={12} /> {tab.label}
              </Button>
            );
          })}
        </div>
      </div>

      {loading ? (
        <div className="text-center py-12 text-sm text-muted-foreground font-mono">Synchronizing Settings catalog...</div>
      ) : (
        <div className="grid lg:grid-cols-3 gap-8">
          
          {/* Editor Column (2/3 size) */}
          <div className="lg:col-span-2 space-y-6">
            
            {/* METRICS FORM */}
            {activeTab === "metrics" && (
              <Card className="border bg-card">
                <CardHeader>
                  <CardTitle className="text-base font-bold">Homepage Statistics</CardTitle>
                  <CardDescription className="text-xs">
                    Update metric stats displayed on the landing page metrics board. 
                    Set values to &quot;—&quot; to display an elegant fallback.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleSaveSettings} className="space-y-5 text-xs font-semibold">
                    <div className="grid grid-cols-2 gap-4">
                      {renderInputField("projects_completed", "Projects Completed")}
                      {renderInputField("happy_clients", "Happy Clients")}
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      {renderInputField("solutions_delivered", "Solutions Delivered")}
                      {renderInputField("years_building", "Years Building")}
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      {renderInputField("satisfaction", "Client Satisfaction (%)")}
                      {renderInputField("custom_software", "Custom Software Built")}
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      {renderInputField("response_time", "Average Response Time")}
                      {renderInputField("countries_served", "Countries Served")}
                    </div>
                    
                    <Button type="submit" disabled={saving} className="h-10 text-xs font-bold flex items-center gap-1.5">
                      <Save size={14} /> {saving ? "Saving stats..." : "Save Metrics"}
                    </Button>
                  </form>
                </CardContent>
              </Card>
            )}

            {/* COMPANY INFO FORM */}
            {activeTab === "company" && (
              <Card className="border bg-card">
                <CardHeader>
                  <CardTitle className="text-base font-bold">Company Specifications</CardTitle>
                  <CardDescription className="text-xs">
                    Configure official contact emails, business telephone details, physical addresses, and general descriptions.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleSaveSettings} className="space-y-5 text-xs font-semibold">
                    <div className="grid grid-cols-2 gap-4">
                      {renderInputField("company_name", "Company Name")}
                      {renderInputField("company_email", "General Contact Email")}
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      {renderInputField("company_phone", "Official Phone Number")}
                      {renderInputField("company_address", "Business Location Address")}
                    </div>
                    {renderInputField("company_description", "Company Description / Watermark", "textarea")}
                    
                    <Button type="submit" disabled={saving} className="h-10 text-xs font-bold flex items-center gap-1.5">
                      <Save size={14} /> {saving ? "Saving company info..." : "Save Details"}
                    </Button>
                  </form>
                </CardContent>
              </Card>
            )}

            {/* HERO CONTENT FORM */}
            {activeTab === "hero" && (
              <Card className="border bg-card">
                <CardHeader>
                  <CardTitle className="text-base font-bold">Homepage Hero Copy</CardTitle>
                  <CardDescription className="text-xs">
                    Modify the primary headline text and promotional descriptions displayed on the landing page hero panel.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleSaveSettings} className="space-y-5 text-xs font-semibold">
                    {renderInputField("hero_title", "Hero Main Headline")}
                    {renderInputField("hero_subtitle", "Hero Subtitle Description", "textarea")}
                    {renderInputField("hero_cta_text", "Hero Call-To-Action Button Label")}
                    
                    <Button type="submit" disabled={saving} className="h-10 text-xs font-bold flex items-center gap-1.5">
                      <Save size={14} /> {saving ? "Saving hero copy..." : "Save Hero Copy"}
                    </Button>
                  </form>
                </CardContent>
              </Card>
            )}

            {/* SEO CONFIG FORM */}
            {activeTab === "seo" && (
              <Card className="border bg-card">
                <CardHeader>
                  <CardTitle className="text-base font-bold">SEO Parameters</CardTitle>
                  <CardDescription className="text-xs">
                    Optimize search engine indexing layout by updating page-level title tags, metadata descriptions, and matching focus keywords.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleSaveSettings} className="space-y-5 text-xs font-semibold">
                    {renderInputField("seo_title", "Meta Document Title")}
                    {renderInputField("seo_description", "Meta Description Tag", "textarea")}
                    {renderInputField("seo_keywords", "Meta Keywords (Comma separated)")}
                    
                    <Button type="submit" disabled={saving} className="h-10 text-xs font-bold flex items-center gap-1.5">
                      <Save size={14} /> {saving ? "Saving SEO config..." : "Save SEO Details"}
                    </Button>
                  </form>
                </CardContent>
              </Card>
            )}

            {/* HEADER MAP FORM */}
            {activeTab === "navlinks" && (
              <Card className="border bg-card">
                <CardHeader>
                  <CardTitle className="text-base font-bold">Header Navigation Links</CardTitle>
                  <CardDescription className="text-xs">
                    Manage the main menu coordinates linked in the website header.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleSaveSettings} className="space-y-5 text-xs font-semibold">
                    {renderNavLinkEditor("nav")}
                    <Button type="submit" disabled={saving} className="h-10 text-xs font-bold flex items-center gap-1.5">
                      <Save size={14} /> {saving ? "Saving links map..." : "Save Navigation"}
                    </Button>
                  </form>
                </CardContent>
              </Card>
            )}

            {/* FOOTER MAP FORM */}
            {activeTab === "footerlinks" && (
              <Card className="border bg-card">
                <CardHeader>
                  <CardTitle className="text-base font-bold">Footer Quick Links</CardTitle>
                  <CardDescription className="text-xs">
                    Manage navigation linkages listed under the Footer coordinate panels.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleSaveSettings} className="space-y-5 text-xs font-semibold">
                    {renderNavLinkEditor("footer")}
                    <Button type="submit" disabled={saving} className="h-10 text-xs font-bold flex items-center gap-1.5">
                      <Save size={14} /> {saving ? "Saving links map..." : "Save Footer Links"}
                    </Button>
                  </form>
                </CardContent>
              </Card>
            )}

            {/* SOCIAL LINKS FORM */}
            {activeTab === "socials" && (
              <Card className="border bg-card">
                <CardHeader>
                  <CardTitle className="text-base font-bold">Social Nav Networks</CardTitle>
                  <CardDescription className="text-xs">
                    Update links to social media networks displayed in the website header and footer.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleSaveSettings} className="space-y-5 text-xs font-semibold">
                    <div className="grid grid-cols-2 gap-4">
                      {renderInputField("social_facebook", "Facebook Link")}
                      {renderInputField("social_twitter", "Twitter/X Link")}
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      {renderInputField("social_github", "GitHub Link")}
                      {renderInputField("social_linkedin", "LinkedIn Link")}
                    </div>
                    
                    <Button type="submit" disabled={saving} className="h-10 text-xs font-bold flex items-center gap-1.5">
                      <Save size={14} /> {saving ? "Saving socials..." : "Save Networks"}
                    </Button>
                  </form>
                </CardContent>
              </Card>
            )}

            {/* FAQ LIST MANAGER */}
            {activeTab === "faqs" && (
              <div className="space-y-6">
                <div className="flex justify-between items-center">
                  <h2 className="text-lg font-bold tracking-tight">Active FAQs</h2>
                  <Button
                    onClick={() => setEditingFaq({ question: "", answer: "", display_order: faqs.length })}
                    size="sm"
                    className="flex items-center gap-1 h-8 text-xs font-bold"
                  >
                    <Plus size={13} /> Add FAQ
                  </Button>
                </div>

                <div className="border border-border/80 rounded-2xl bg-card overflow-hidden divide-y divide-border/60">
                  {faqs.map((faq, fIdx) => (
                    <div key={faq.id || fIdx} className="p-4 flex justify-between items-start hover:bg-white/5 transition-colors gap-4">
                      <div className="space-y-1">
                        <h4 className="text-xs font-black text-foreground">{faq.question}</h4>
                        <p className="text-[11px] text-muted-foreground leading-relaxed font-semibold">{faq.answer}</p>
                      </div>
                      <div className="flex gap-2 flex-shrink-0">
                        <Button
                          onClick={() => setEditingFaq(faq)}
                          variant="outline"
                          size="sm"
                          className="h-7 w-7 p-0"
                        >
                          <Plus size={12} className="rotate-45" />
                        </Button>
                        <Button
                          onClick={() => handleDeleteFaq(faq.id)}
                          variant="outline"
                          size="sm"
                          className="h-7 w-7 p-0 text-destructive hover:bg-destructive/10 border-destructive/20"
                        >
                          <Trash2 size={12} />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* TESTIMONIALS MANAGER */}
            {activeTab === "testimonials" && (
              <div className="space-y-6">
                <div className="flex justify-between items-center">
                  <h2 className="text-lg font-bold tracking-tight">Client Testimonials</h2>
                  <Button
                    onClick={() => setEditingTestimonial({ name: "", role: "", text: "", rating: 5, display_order: testimonials.length })}
                    size="sm"
                    className="flex items-center gap-1 h-8 text-xs font-bold"
                  >
                    <Plus size={13} /> Add Review
                  </Button>
                </div>

                <div className="border border-border/80 rounded-2xl bg-card overflow-hidden divide-y divide-border/60">
                  {testimonials.map((t, tIdx) => (
                    <div key={t.id || tIdx} className="p-4 flex justify-between items-start hover:bg-white/5 transition-colors gap-4">
                      <div className="space-y-1">
                        <div className="flex items-center gap-1.5">
                          <h4 className="text-xs font-black text-foreground">{t.name}</h4>
                          <span className="text-[10px] text-muted-foreground">({t.role})</span>
                          <span className="text-[9px] bg-primary/10 text-primary px-1.5 py-0.5 rounded border border-primary/20">
                            {t.rating} Stars
                          </span>
                        </div>
                        <p className="text-[11px] text-muted-foreground leading-relaxed italic font-semibold">&ldquo;{t.text}&rdquo;</p>
                      </div>
                      <div className="flex gap-2 flex-shrink-0">
                        <Button
                          onClick={() => setEditingTestimonial(t)}
                          variant="outline"
                          size="sm"
                          className="h-7 w-7 p-0"
                        >
                          <Plus size={12} className="rotate-45" />
                        </Button>
                        <Button
                          onClick={() => handleDeleteTestimonial(t.id)}
                          variant="outline"
                          size="sm"
                          className="h-7 w-7 p-0 text-destructive hover:bg-destructive/10 border-destructive/20"
                        >
                          <Trash2 size={12} />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
 
            {/* SERVICES CMS MANAGER */}
            {activeTab === "services" && (
              <div className="space-y-6">
                <div className="flex justify-between items-center">
                  <h2 className="text-lg font-bold tracking-tight">Active Services</h2>
                  <Button
                    onClick={() => setEditingService({ slug: "", title: "", shortDescription: "", description: "", features: [], display_order: services.length })}
                    size="sm"
                    className="flex items-center gap-1 h-8 text-xs font-bold"
                  >
                    <Plus size={13} /> Add Service
                  </Button>
                </div>

                <div className="border border-border/80 rounded-2xl bg-card overflow-hidden divide-y divide-border/60">
                  {services.map((service, sIdx) => (
                    <div key={service.id || sIdx} className="p-4 flex justify-between items-start hover:bg-white/5 transition-colors gap-4">
                      <div className="space-y-1">
                        <div className="flex items-center gap-1.5">
                          <h4 className="text-xs font-black text-foreground">{service.title}</h4>
                          <span className="text-[10px] text-muted-foreground">({service.slug})</span>
                        </div>
                        <p className="text-[11px] text-muted-foreground leading-relaxed font-semibold">
                          {(service as unknown as { short_description?: string }).short_description || service.shortDescription || ""}
                        </p>
                      </div>
                      <div className="flex gap-2 flex-shrink-0">
                        <Button
                          onClick={() => setEditingService(normalizeServiceRecord(service))}
                          variant="outline"
                          size="sm"
                          className="h-7 w-7 p-0"
                        >
                          <Plus size={12} className="rotate-45" />
                        </Button>
                        <Button
                          onClick={() => handleDeleteService(service.id)}
                          variant="outline"
                          size="sm"
                          className="h-7 w-7 p-0 text-destructive hover:bg-destructive/10 border-destructive/20"
                        >
                          <Trash2 size={12} />
                        </Button>
                      </div>
                    </div>
                  ))}
                  {services.length === 0 && (
                    <div className="p-8 text-center text-xs text-muted-foreground italic font-semibold">No services configured.</div>
                  )}
                </div>
              </div>
            )}

            {/* TEAM CMS MANAGER */}
            {activeTab === "team" && (
              <div className="space-y-6">
                <div className="flex justify-between items-center">
                  <h2 className="text-lg font-bold tracking-tight">Team Roster</h2>
                  <Button
                    onClick={() => setEditingTeam({ name: "", role: "", image_url: "", display_order: teamMembers.length })}
                    size="sm"
                    className="flex items-center gap-1 h-8 text-xs font-bold"
                  >
                    <Plus size={13} /> Add Member
                  </Button>
                </div>

                <div className="border border-border/80 rounded-2xl bg-card overflow-hidden divide-y divide-border/60">
                  {teamMembers.map((member, mIdx) => (
                    <div key={member.id || mIdx} className="p-4 flex justify-between items-start hover:bg-white/5 transition-colors gap-4">
                      <div className="flex items-center gap-3">
                        <div className="relative w-10 h-10 rounded-full overflow-hidden border border-border/60">
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img
                            src={member.image_url}
                            alt={member.name}
                            className="w-full h-full object-cover"
                            onError={(e) => {
                              // Elegant fallback if image fails to load
                              (e.target as HTMLImageElement).src = "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&h=150&fit=crop&crop=face";
                            }}
                          />
                        </div>
                        <div className="space-y-0.5">
                          <h4 className="text-xs font-black text-foreground">{member.name}</h4>
                          <p className="text-[10px] text-primary font-bold">{member.role}</p>
                        </div>
                      </div>
                      <div className="flex gap-2 flex-shrink-0">
                        <Button
                          onClick={() => setEditingTeam(member)}
                          variant="outline"
                          size="sm"
                          className="h-7 w-7 p-0"
                        >
                          <Plus size={12} className="rotate-45" />
                        </Button>
                        <Button
                          onClick={() => handleDeleteTeam(member.id)}
                          variant="outline"
                          size="sm"
                          className="h-7 w-7 p-0 text-destructive hover:bg-destructive/10 border-destructive/20"
                        >
                          <Trash2 size={12} />
                        </Button>
                      </div>
                    </div>
                  ))}
                  {teamMembers.length === 0 && (
                    <div className="p-8 text-center text-xs text-muted-foreground italic font-semibold">No team members configured.</div>
                  )}
                </div>
              </div>
            )}

          </div>

          {/* Modal / Editing Side Panels */}
          <div className="space-y-6">
            
            {/* FAQ EDITOR PANEL */}
            {editingFaq && (
              <Card className="border bg-card">
                <CardHeader>
                  <CardTitle className="text-sm font-bold">
                    {editingFaq.id ? "Edit FAQ Row" : "Create FAQ Item"}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleSaveFaqSubmit} className="space-y-4 text-xs font-semibold">
                    <div className="space-y-1">
                      <Label htmlFor="faq_question">Question text</Label>
                      <Input
                        id="faq_question"
                        value={editingFaq.question || ""}
                        onChange={(e) => setEditingFaq({ ...editingFaq, question: e.target.value })}
                        required
                      />
                    </div>
                    <div className="space-y-1">
                      <Label htmlFor="faq_answer">Answer text</Label>
                      <Textarea
                        id="faq_answer"
                        rows={4}
                        value={editingFaq.answer || ""}
                        onChange={(e) => setEditingFaq({ ...editingFaq, answer: e.target.value })}
                        required
                      />
                    </div>
                    <div className="space-y-1">
                      <Label htmlFor="faq_order">Display Weight</Label>
                      <Input
                        id="faq_order"
                        type="number"
                        value={editingFaq.display_order || 0}
                        onChange={(e) => setEditingFaq({ ...editingFaq, display_order: Number(e.target.value) })}
                      />
                    </div>
                    
                    <div className="flex gap-2 pt-2">
                      <Button type="submit" className="flex-grow">Save FAQ</Button>
                      <Button type="button" variant="outline" onClick={() => setEditingFaq(null)}>Cancel</Button>
                    </div>
                  </form>
                </CardContent>
              </Card>
            )}

            {/* TESTIMONIAL EDITOR PANEL */}
            {editingTestimonial && (
              <Card className="border bg-card">
                <CardHeader>
                  <CardTitle className="text-sm font-bold">
                    {editingTestimonial.id ? "Edit Review Card" : "Add Testimonial Review"}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleSaveTestimonialSubmit} className="space-y-4 text-xs font-semibold">
                    <div className="grid grid-cols-2 gap-3">
                      <div className="space-y-1">
                        <Label htmlFor="t_name">Author Name</Label>
                        <Input
                          id="t_name"
                          value={editingTestimonial.name || ""}
                          onChange={(e) => setEditingTestimonial({ ...editingTestimonial, name: e.target.value })}
                          required
                        />
                      </div>
                      <div className="space-y-1">
                        <Label htmlFor="t_role">Author Role / Title</Label>
                        <Input
                          id="t_role"
                          value={editingTestimonial.role || ""}
                          onChange={(e) => setEditingTestimonial({ ...editingTestimonial, role: e.target.value })}
                          required
                        />
                      </div>
                    </div>
                    <div className="space-y-1">
                      <Label htmlFor="t_text">Review Quote Text</Label>
                      <Textarea
                        id="t_text"
                        rows={3}
                        value={editingTestimonial.text || ""}
                        onChange={(e) => setEditingTestimonial({ ...editingTestimonial, text: e.target.value })}
                        required
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <div className="space-y-1">
                        <Label htmlFor="t_rating">Star Rating (1-5)</Label>
                        <select
                          id="t_rating"
                          value={editingTestimonial.rating || 5}
                          onChange={(e) => setEditingTestimonial({ ...editingTestimonial, rating: Number(e.target.value) })}
                          className="w-full border border-input rounded-md h-9 px-2 bg-transparent"
                        >
                          <option value={5}>5 Stars</option>
                          <option value={4}>4 Stars</option>
                          <option value={3}>3 Stars</option>
                          <option value={2}>2 Stars</option>
                          <option value={1}>1 Star</option>
                        </select>
                      </div>
                      <div className="space-y-1">
                        <Label htmlFor="t_order">Display Weight</Label>
                        <Input
                          id="t_order"
                          type="number"
                          value={editingTestimonial.display_order || 0}
                          onChange={(e) => setEditingTestimonial({ ...editingTestimonial, display_order: Number(e.target.value) })}
                        />
                      </div>
                    </div>

                    <div className="flex gap-2 pt-2">
                      <Button type="submit" className="flex-grow">Save Review</Button>
                      <Button type="button" variant="outline" onClick={() => setEditingTestimonial(null)}>Cancel</Button>
                    </div>
                  </form>
                </CardContent>
              </Card>
            )}

            {/* SERVICE EDITOR PANEL */}
            {editingService && (
              <Card className="border bg-card">
                <CardHeader>
                  <CardTitle className="text-sm font-bold">
                    {editingService.id ? "Edit Service" : "Create Service"}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleSaveServiceSubmit} className="space-y-4 text-xs font-semibold">
                    <div className="space-y-1">
                      <Label htmlFor="s_title">Service Title</Label>
                      <Input
                        id="s_title"
                        value={editingService.title || ""}
                        onChange={(e) => setEditingService({ ...editingService, title: e.target.value })}
                        required
                      />
                    </div>
                    <div className="space-y-1">
                      <Label htmlFor="s_slug">Slug (lowercase, hyphens)</Label>
                      <Input
                        id="s_slug"
                        value={editingService.slug || ""}
                        onChange={(e) => setEditingService({ ...editingService, slug: e.target.value.toLowerCase().replace(/\s+/g, "-") })}
                        required
                        placeholder="e.g. cloud-deployment"
                      />
                    </div>
                    <div className="space-y-1">
                      <Label htmlFor="s_short_desc">Short Description (Max 200 chars)</Label>
                      <Input
                        id="s_short_desc"
                        value={editingService.shortDescription || ""}
                        onChange={(e) => setEditingService({ ...editingService, shortDescription: e.target.value })}
                        required
                      />
                    </div>
                    <div className="space-y-1">
                      <Label htmlFor="s_desc">Detailed Description</Label>
                      <Textarea
                        id="s_desc"
                        rows={4}
                        value={editingService.description || ""}
                        onChange={(e) => setEditingService({ ...editingService, description: e.target.value })}
                        required
                      />
                    </div>
                    <div className="space-y-1">
                      <Label htmlFor="s_features">Features / Scope items (comma separated)</Label>
                      <Input
                        id="s_features"
                        value={(editingService.features || []).join(", ")}
                        onChange={(e) => setEditingService({ ...editingService, features: e.target.value.split(",").map(item => item.trim()).filter(Boolean) })}
                        placeholder="e.g. Auth flow, DB Migrations, Stripe Setup"
                      />
                    </div>
                    <div className="space-y-1">
                      <Label htmlFor="s_order">Display Weight</Label>
                      <Input
                        id="s_order"
                        type="number"
                        value={editingService.display_order || 0}
                        onChange={(e) => setEditingService({ ...editingService, display_order: Number(e.target.value) })}
                      />
                    </div>
                    
                    <div className="flex gap-2 pt-2">
                      <Button type="submit" className="flex-grow">Save Service</Button>
                      <Button type="button" variant="outline" onClick={() => setEditingService(null)}>Cancel</Button>
                    </div>
                  </form>
                </CardContent>
              </Card>
            )}

            {/* TEAM MEMBER EDITOR PANEL */}
            {editingTeam && (
              <Card className="border bg-card">
                <CardHeader>
                  <CardTitle className="text-sm font-bold">
                    {editingTeam.id ? "Edit Team Member" : "Add Team Member"}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleSaveTeamSubmit} className="space-y-4 text-xs font-semibold">
                    <div className="space-y-1">
                      <Label htmlFor="team_name">Full Name</Label>
                      <Input
                        id="team_name"
                        value={editingTeam.name || ""}
                        onChange={(e) => setEditingTeam({ ...editingTeam, name: e.target.value })}
                        required
                      />
                    </div>
                    <div className="space-y-1">
                      <Label htmlFor="team_role">Role / Position</Label>
                      <Input
                        id="team_role"
                        value={editingTeam.role || ""}
                        onChange={(e) => setEditingTeam({ ...editingTeam, role: e.target.value })}
                        required
                        placeholder="e.g. Principal Architect"
                      />
                    </div>
                    <div className="space-y-1">
                      <Label htmlFor="team_image">Image URL</Label>
                      <Input
                        id="team_image"
                        value={editingTeam.image_url || ""}
                        onChange={(e) => setEditingTeam({ ...editingTeam, image_url: e.target.value })}
                        required
                        placeholder="https://images.unsplash.com/..."
                      />
                    </div>
                    <div className="space-y-1">
                      <Label htmlFor="team_order">Display Weight</Label>
                      <Input
                        id="team_order"
                        type="number"
                        value={editingTeam.display_order || 0}
                        onChange={(e) => setEditingTeam({ ...editingTeam, display_order: Number(e.target.value) })}
                      />
                    </div>
                    
                    <div className="flex gap-2 pt-2">
                      <Button type="submit" className="flex-grow">Save Member</Button>
                      <Button type="button" variant="outline" onClick={() => setEditingTeam(null)}>Cancel</Button>
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
