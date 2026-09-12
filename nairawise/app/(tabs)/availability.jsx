import { useState, useEffect } from 'react';
import { View, Text, ScrollView, TouchableOpacity, TextInput, Switch, Modal } from 'react-native';
import { toast } from 'sonner-native';
import { Clock, Plus, X, ChevronRight, Trash2 } from 'lucide-react-native';
import { useTheme } from '../../src/theme/ThemeContext';
import { setAvailability, createEventType, getHostSchedule } from '../../src/api/scheduling';
import { getStoredUser } from '../../src/api/auth';

const DAYS = [
  { key: 0, label: 'Sunday', short: 'Sun' },
  { key: 1, label: 'Monday', short: 'Mon' },
  { key: 2, label: 'Tuesday', short: 'Tue' },
  { key: 3, label: 'Wednesday', short: 'Wed' },
  { key: 4, label: 'Thursday', short: 'Thu' },
  { key: 5, label: 'Friday', short: 'Fri' },
  { key: 6, label: 'Saturday', short: 'Sat' },
];

const DEFAULT_START = '09:00';
const DEFAULT_END = '17:00';

function TimeInput({ value, onChange, theme }) {
  return (
    <TextInput
      value={value}
      onChangeText={onChange}
      placeholder="09:00"
      placeholderTextColor={theme.textMuted}
      keyboardType="numbers-and-punctuation"
      maxLength={5}
      className="text-sm font-semibold text-center rounded-xl py-2.5 px-3 border"
      style={{ color: theme.textPrimary, backgroundColor: theme.background, borderColor: theme.border, width: 72 }}
    />
  );
}

export default function AvailabilityScreen() {
  const { theme, isDark } = useTheme();

  const [weekSchedule, setWeekSchedule] = useState(
    DAYS.reduce((acc, d) => {
      acc[d.key] = { enabled: d.key >= 1 && d.key <= 5, startTime: DEFAULT_START, endTime: DEFAULT_END };
      return acc;
    }, {})
  );
  const [eventTypes, setEventTypes] = useState([]);
  const [saving, setSaving] = useState(false);

  const [showModal, setShowModal] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newDuration, setNewDuration] = useState('30');
  const [newBuffer, setNewBuffer] = useState('5');
  const [newNotice, setNewNotice] = useState('1');
  const [creatingType, setCreatingType] = useState(false);

  useEffect(() => {
    (async () => {
      try {
        const user = await getStoredUser();
        if (!user?._id) return;
        const res = await getHostSchedule(user._id);
        setEventTypes(res.eventTypes || []);
        if (res.weeklyHours?.length) {
          setWeekSchedule((prev) => {
            const next = { ...prev };
            res.weeklyHours.forEach((h) => {
              next[h.dayOfWeek] = { enabled: true, startTime: h.startTime, endTime: h.endTime };
            });
            return next;
          });
        }
      } catch (e) {
        // silent — fresh host, nothing set up yet
      }
    })();
  }, []);

  const toggleDay = (dayKey) => {
    setWeekSchedule((prev) => ({
      ...prev,
      [dayKey]: { ...prev[dayKey], enabled: !prev[dayKey].enabled },
    }));
  };

  const updateDayTime = (dayKey, field, value) => {
    setWeekSchedule((prev) => ({
      ...prev,
      [dayKey]: { ...prev[dayKey], [field]: value },
    }));
  };

  const handleSaveAvailability = async () => {
    const timePattern = /^([01]\d|2[0-3]):([0-5]\d)$/;
    const weeklyHours = Object.entries(weekSchedule)
      .filter(([, v]) => v.enabled)
      .map(([dayOfWeek, v]) => ({ dayOfWeek: Number(dayOfWeek), startTime: v.startTime, endTime: v.endTime }));

    if (weeklyHours.length === 0) {
      toast.error('Enable at least one day');
      return;
    }
    for (const h of weeklyHours) {
      if (!timePattern.test(h.startTime) || !timePattern.test(h.endTime)) {
        toast.error('Times must be in HH:MM format, e.g. 09:00');
        return;
      }
      if (h.startTime >= h.endTime) {
        toast.error('Start time must be before end time');
        return;
      }
    }

    setSaving(true);
    try {
      await setAvailability(weeklyHours);
      toast.success('Availability saved');
    } catch (err) {
      toast.error(err?.response?.data?.message || 'Failed to save availability');
    } finally {
      setSaving(false);
    }
  };

  const handleCreateEventType = async () => {
    if (!newTitle.trim()) {
      toast.error('Give this event type a name');
      return;
    }
    const duration = Number(newDuration);
    if (!duration || duration <= 0) {
      toast.error('Enter a valid duration');
      return;
    }

    setCreatingType(true);
    try {
      const slug = newTitle.trim().toLowerCase().replace(/\s+/g, '-');
      const created = await createEventType({
        title: newTitle.trim(),
        slug,
        duration,
        bufferBefore: Number(newBuffer) || 0,
        bufferAfter: Number(newBuffer) || 0,
        minNoticeHours: Number(newNotice) || 1,
      });
      setEventTypes((prev) => [...prev, created]);
      toast.success('Event type created');
      setShowModal(false);
      setNewTitle('');
      setNewDuration('30');
      setNewBuffer('5');
      setNewNotice('1');
    } catch (err) {
      toast.error(err?.response?.data?.message || 'Failed to create event type');
    } finally {
      setCreatingType(false);
    }
  };

  return (
    <View style={{ flex: 1, backgroundColor: theme.background }}>
      <ScrollView contentContainerStyle={{ paddingBottom: 40 }} showsVerticalScrollIndicator={false}>
        <View className="px-6 pt-16 pb-6">
          <Text style={{ color: theme.textPrimary }} className="text-2xl font-bold mb-1">
            My Availability
          </Text>
          <Text style={{ color: theme.textSecondary }} className="text-sm mb-8">
            Set your weekly hours and the types of sessions people can book with you.
          </Text>

          {/* Weekly hours */}
          <View className="flex-row items-center mb-4">
            <Clock size={16} color={theme.textSecondary} />
            <Text style={{ color: theme.textPrimary }} className="text-base font-bold ml-2">
              Weekly hours
            </Text>
          </View>

          <View className="mb-6">
            {DAYS.map((d) => {
              const day = weekSchedule[d.key];
              return (
                <View
                  key={d.key}
                  className="flex-row items-center justify-between rounded-2xl p-4 mb-2.5"
                  style={{ backgroundColor: theme.surface, borderWidth: 1, borderColor: theme.border }}
                >
                  <View className="flex-row items-center" style={{ width: 90 }}>
                    <Switch
                      value={day.enabled}
                      onValueChange={() => toggleDay(d.key)}
                      trackColor={{ false: theme.border, true: theme.primaryMuted }}
                      thumbColor={theme.primary}
                    />
                    <Text
                      style={{ color: day.enabled ? theme.textPrimary : theme.textMuted }}
                      className="text-sm font-semibold ml-2.5"
                    >
                      {d.short}
                    </Text>
                  </View>

                  {day.enabled ? (
                    <View className="flex-row items-center" style={{ gap: 8 }}>
                      <TimeInput
                        value={day.startTime}
                        onChange={(v) => updateDayTime(d.key, 'startTime', v)}
                        theme={theme}
                      />
                      <Text style={{ color: theme.textMuted }} className="text-xs">to</Text>
                      <TimeInput
                        value={day.endTime}
                        onChange={(v) => updateDayTime(d.key, 'endTime', v)}
                        theme={theme}
                      />
                    </View>
                  ) : (
                    <Text style={{ color: theme.textMuted }} className="text-xs">Unavailable</Text>
                  )}
                </View>
              );
            })}
          </View>

          <TouchableOpacity
            onPress={handleSaveAvailability}
            disabled={saving}
            className="rounded-2xl py-4 items-center mb-10"
            style={{ backgroundColor: theme.primary, opacity: saving ? 0.7 : 1 }}
          >
            <Text style={{ color: theme.onPrimary }} className="text-base font-bold">
              {saving ? 'Saving...' : 'Save Weekly Hours'}
            </Text>
          </TouchableOpacity>

          {/* Event types */}
          <View className="flex-row items-center justify-between mb-4">
            <Text style={{ color: theme.textPrimary }} className="text-base font-bold">
              Event Types
            </Text>
            <TouchableOpacity
              onPress={() => setShowModal(true)}
              className="flex-row items-center rounded-full px-3.5 py-2"
              style={{ backgroundColor: theme.primaryMuted }}
            >
              <Plus size={14} color={theme.onPrimary} />
              <Text style={{ color: theme.onPrimary }} className="text-xs font-bold ml-1">
                New
              </Text>
            </TouchableOpacity>
          </View>

          {eventTypes.length === 0 ? (
            <View
              className="rounded-2xl p-8 items-center"
              style={{ backgroundColor: theme.surface, borderWidth: 1, borderColor: theme.border }}
            >
              <Text style={{ color: theme.textMuted }} className="text-sm text-center">
                No event types yet.{'\n'}Create one so people can book time with you.
              </Text>
            </View>
          ) : (
            eventTypes.map((et) => (
              <View
                key={et._id}
                className="flex-row items-center justify-between rounded-2xl p-4 mb-2.5"
                style={{ backgroundColor: theme.surface, borderWidth: 1, borderColor: theme.border }}
              >
                <View className="flex-1">
                  <Text style={{ color: theme.textPrimary }} className="text-sm font-bold mb-1">
                    {et.title}
                  </Text>
                  <Text style={{ color: theme.textSecondary }} className="text-xs">
                    {et.duration} min · {et.minNoticeHours}h notice · {et.bufferBefore}min buffer
                  </Text>
                </View>
                <ChevronRight size={18} color={theme.textMuted} />
              </View>
            ))
          )}
        </View>
      </ScrollView>

      {/* Create event type modal */}
      <Modal visible={showModal} transparent animationType="slide" onRequestClose={() => setShowModal(false)}>
        <View className="flex-1 justify-end" style={{ backgroundColor: theme.overlay }}>
          <View
            className="rounded-t-3xl p-6"
            style={{ backgroundColor: theme.background, borderTopWidth: 1, borderColor: theme.border }}
          >
            <View className="flex-row items-center justify-between mb-6">
              <Text style={{ color: theme.textPrimary }} className="text-lg font-bold">
                New Event Type
              </Text>
              <TouchableOpacity onPress={() => setShowModal(false)}>
                <X size={22} color={theme.textMuted} />
              </TouchableOpacity>
            </View>

            <Text style={{ color: theme.textSecondary }} className="text-sm font-medium mb-2">
              Title
            </Text>
            <TextInput
              value={newTitle}
              onChangeText={setNewTitle}
              placeholder="e.g. 30-min Consultation"
              placeholderTextColor={theme.textMuted}
              className="rounded-2xl px-4 py-3.5 mb-4 border text-[15px]"
              style={{ backgroundColor: theme.surface, borderColor: theme.border, color: theme.textPrimary }}
            />

            <View className="flex-row" style={{ gap: 12 }}>
              <View className="flex-1">
                <Text style={{ color: theme.textSecondary }} className="text-sm font-medium mb-2">
                  Duration (min)
                </Text>
                <TextInput
                  value={newDuration}
                  onChangeText={setNewDuration}
                  keyboardType="number-pad"
                  className="rounded-2xl px-4 py-3.5 mb-4 border text-[15px]"
                  style={{ backgroundColor: theme.surface, borderColor: theme.border, color: theme.textPrimary }}
                />
              </View>
              <View className="flex-1">
                <Text style={{ color: theme.textSecondary }} className="text-sm font-medium mb-2">
                  Buffer (min)
                </Text>
                <TextInput
                  value={newBuffer}
                  onChangeText={setNewBuffer}
                  keyboardType="number-pad"
                  className="rounded-2xl px-4 py-3.5 mb-4 border text-[15px]"
                  style={{ backgroundColor: theme.surface, borderColor: theme.border, color: theme.textPrimary }}
                />
              </View>
            </View>

            <Text style={{ color: theme.textSecondary }} className="text-sm font-medium mb-2">
              Minimum notice (hours)
            </Text>
            <TextInput
              value={newNotice}
              onChangeText={setNewNotice}
              keyboardType="number-pad"
              className="rounded-2xl px-4 py-3.5 mb-6 border text-[15px]"
              style={{ backgroundColor: theme.surface, borderColor: theme.border, color: theme.textPrimary }}
            />

            <TouchableOpacity
              onPress={handleCreateEventType}
              disabled={creatingType}
              className="rounded-2xl py-4 items-center"
              style={{ backgroundColor: theme.primary, opacity: creatingType ? 0.7 : 1 }}
            >
              <Text style={{ color: theme.onPrimary }} className="text-base font-bold">
                {creatingType ? 'Creating...' : 'Create Event Type'}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
}