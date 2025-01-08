'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { useState } from 'react';
import { createClient } from '@/utils/supabase/client';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

export function AccountSettings() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [language, setLanguage] = useState('english');
  const [notifications, setNotifications] = useState(true);
  const supabase = createClient();

  const handleUpdateProfile = async () => {
    try {
      const { error } = await supabase.auth.updateUser({
        email: email || undefined,
        data: {
          name: name || undefined,
          language,
          notifications,
        },
      });

      if (error) throw error;
      alert('Profile updated successfully!');
    } catch (error) {
      console.error('Error updating profile:', error);
      alert('Error updating profile. Please try again.');
    }
  };

  return (
    <Tabs defaultValue="profile" className="space-y-6">
      <TabsList>
        <TabsTrigger value="profile">Profile</TabsTrigger>
        <TabsTrigger value="preferences">Preferences</TabsTrigger>
        <TabsTrigger value="notifications">Notifications</TabsTrigger>
        <TabsTrigger value="security">Security</TabsTrigger>
      </TabsList>

      <TabsContent value="profile">
        <Card className="bg-background/50 backdrop-blur-[24px] border-border p-6">
          <CardHeader className="p-0 space-y-4">
            <CardTitle className="text-2xl font-medium">Profile Settings</CardTitle>
          </CardHeader>
          <CardContent className="p-0 mt-6 space-y-6">
            <div className="space-y-2">
              <label className="text-sm font-medium">Display Name</label>
              <Input placeholder="Enter your name" value={name} onChange={(e) => setName(e.target.value)} />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Email</label>
              <Input
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <Button onClick={handleUpdateProfile} className="w-full">
              Save Changes
            </Button>
          </CardContent>
        </Card>
      </TabsContent>

      <TabsContent value="preferences">
        <Card className="bg-background/50 backdrop-blur-[24px] border-border p-6">
          <CardHeader className="p-0 space-y-4">
            <CardTitle className="text-2xl font-medium">Preferences</CardTitle>
          </CardHeader>
          <CardContent className="p-0 mt-6 space-y-6">
            <div className="space-y-2">
              <label className="text-sm font-medium">Language</label>
              <Select value={language} onValueChange={setLanguage}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="english">English</SelectItem>
                  <SelectItem value="spanish">Spanish</SelectItem>
                  <SelectItem value="french">French</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <Button onClick={handleUpdateProfile} className="w-full">
              Save Preferences
            </Button>
          </CardContent>
        </Card>
      </TabsContent>

      <TabsContent value="notifications">
        <Card className="bg-background/50 backdrop-blur-[24px] border-border p-6">
          <CardHeader className="p-0 space-y-4">
            <CardTitle className="text-2xl font-medium">Notification Settings</CardTitle>
          </CardHeader>
          <CardContent className="p-0 mt-6 space-y-6">
            <div className="flex items-center justify-between">
              <label className="text-sm font-medium">Email Notifications</label>
              <Switch checked={notifications} onCheckedChange={setNotifications} />
            </div>
            <Button onClick={handleUpdateProfile} className="w-full">
              Save Notification Settings
            </Button>
          </CardContent>
        </Card>
      </TabsContent>

      <TabsContent value="security">
        <Card className="bg-background/50 backdrop-blur-[24px] border-border p-6">
          <CardHeader className="p-0 space-y-4">
            <CardTitle className="text-2xl font-medium">Security Settings</CardTitle>
          </CardHeader>
          <CardContent className="p-0 mt-6 space-y-6">
            <div className="space-y-2">
              <label className="text-sm font-medium">Current Password</label>
              <Input type="password" placeholder="Enter current password" />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">New Password</label>
              <Input type="password" placeholder="Enter new password" />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Confirm New Password</label>
              <Input type="password" placeholder="Confirm new password" />
            </div>
            <Button className="w-full">Update Password</Button>
          </CardContent>
        </Card>
      </TabsContent>
    </Tabs>
  );
}
