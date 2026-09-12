import { useState, useEffect, useCallback } from 'react';
import { View, Text, ScrollView, TouchableOpacity, ActivityIndicator } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { toast } from 'sonner-native';
import { Clock, Calendar, ChevronLeft } from 'lucide-react-native';
import { useTheme } from '../../src/theme/ThemeContext';
import { getHostSchedule, getAvailableSlots, createBooking } from '../../src/api/scheduling';



function nextNDays(n) {
  return Array.from({ length: n }, (_, i) => {
    const d = new Date();
    d.setDate(d.getDate() + i);
    return d;
  });
}

export default function BookingScreen() {
  const { theme, isDark } = useTheme();
  const router = useRouter();
  const { userId } = useLocalSearchParams();

  const [eventTypes, setEventTypes] = useState([]);
  const [selectedEventType, setSelectedEventType] = useState(null);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [slots, setSlots] = useState([]);
  const [loadingSlots, setLoadingSlots] = useState(false);
  const [booking, setBooking] = useState(false);

  useEffect(() => {
    (async () => {
      const res = await getHostSchedule(userId);
      setEventTypes(res.eventTypes);
      if (res.eventTypes[0]) setSelectedEventType(res.eventTypes[0]);
    })();
  }, [userId]);

  const fetchSlots = useCallback(async () => {
    if (!selectedEventType) return;
    setLoadingSlots(true);
    try {
      const dateStr = selectedDate.toISOString().split('T')[0];
      const res = await getAvailableSlots(userId, selectedEventType._id, dateStr);
      setSlots(res.slots);
    } catch (err) {
      toast.error('Failed to load slots');
    } finally {
      setLoadingSlots(false);
    }
  }, [userId, selectedEventType, selectedDate]);

  useEffect(() => { fetchSlots(); }, [fetchSlots]);

  const handleBook = async (slot) => {
    setBooking(true);
    try {
      await createBooking({
        hostId: userId,
        eventTypeId: selectedEventType._id,
        startTime: slot,
      });
      toast.success('Booking confirmed!');
      router.back();
    } catch (err) {
      toast.error(err?.response?.data?.message || 'Failed to book');
      fetchSlots(); // refresh in case slot was taken
    } finally {
      setBooking(false);
    }
  };

  const days = nextNDays(14);

  return (
    <View style={{ flex: 1, backgroundColor: theme.background }}>
      <ScrollView contentContainerStyle={{ paddingBottom: 40 }} showsVerticalScrollIndicator={false}>
        <View className="px-6 pt-16 pb-6">
          <TouchableOpacity
            onPress={() => router.back()}
            className="w-10 h-10 rounded-full items-center justify-center mb-6"
            style={{ backgroundColor: theme.surface, borderWidth: 1, borderColor: theme.border }}
          >
            <ChevronLeft size={20} color={theme.textPrimary} />
          </TouchableOpacity>

          <Text style={{ color: theme.textPrimary }} className="text-2xl font-bold mb-1">
            Book a time
          </Text>
          <Text style={{ color: theme.textSecondary }} className="text-sm mb-6">
            Pick an event type, date, and time that works for you.
          </Text>

          {/* Event type selector */}
          {eventTypes.length > 0 && (
            <ScrollView horizontal showsHorizontalScrollIndicator={false} className="mb-6" contentContainerStyle={{ gap: 10 }}>
              {eventTypes.map((et) => {
                const active = selectedEventType?._id === et._id;
                return (
                  <TouchableOpacity
                    key={et._id}
                    onPress={() => setSelectedEventType(et)}
                    className="rounded-2xl px-4 py-3 border"
                    style={{
                      backgroundColor: active ? theme.primary : theme.surface,
                      borderColor: active ? theme.primary : theme.border,
                    }}
                  >
                    <Text
                      className="text-sm font-bold"
                      style={{ color: active ? theme.onPrimary : theme.textPrimary }}
                    >
                      {et.title}
                    </Text>
                    <Text
                      className="text-xs mt-0.5"
                      style={{ color: active ? theme.onPrimary : theme.textSecondary, opacity: 0.8 }}
                    >
                      {et.duration} min
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </ScrollView>
          )}

          {/* Date strip */}
          <View className="flex-row items-center mb-3">
            <Calendar size={16} color={theme.textSecondary} />
            <Text style={{ color: theme.textSecondary }} className="text-sm font-medium ml-2">
              Select a date
            </Text>
          </View>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} className="mb-6" contentContainerStyle={{ gap: 8 }}>
            {days.map((d) => {
              const active = d.toDateString() === selectedDate.toDateString();
              return (
                <TouchableOpacity
                  key={d.toISOString()}
                  onPress={() => setSelectedDate(d)}
                  className="items-center rounded-2xl px-3.5 py-3 border"
                  style={{
                    backgroundColor: active ? theme.primary : theme.surface,
                    borderColor: active ? theme.primary : theme.border,
                    minWidth: 56,
                  }}
                >
                  <Text
                    className="text-[10px] font-semibold"
                    style={{ color: active ? theme.onPrimary : theme.textSecondary, opacity: 0.85 }}
                  >
                    {d.toLocaleDateString('en-US', { weekday: 'short' })}
                  </Text>
                  <Text
                    className="text-base font-bold mt-0.5"
                    style={{ color: active ? theme.onPrimary : theme.textPrimary }}
                  >
                    {d.getDate()}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </ScrollView>

          {/* Time slots */}
          <View className="flex-row items-center mb-3">
            <Clock size={16} color={theme.textSecondary} />
            <Text style={{ color: theme.textSecondary }} className="text-sm font-medium ml-2">
              Available times
            </Text>
          </View>

          {loadingSlots ? (
            <ActivityIndicator color={theme.primary} style={{ marginTop: 20 }} />
          ) : slots.length === 0 ? (
            <View
              className="rounded-2xl p-6 items-center"
              style={{ backgroundColor: theme.surface, borderWidth: 1, borderColor: theme.border }}
            >
              <Text style={{ color: theme.textMuted }} className="text-sm">
                No available slots this day
              </Text>
            </View>
          ) : (
            <View className="flex-row flex-wrap" style={{ gap: 10 }}>
              {slots.map((slot) => (
                <TouchableOpacity
                  key={slot}
                  onPress={() => handleBook(slot)}
                  disabled={booking}
                  className="rounded-xl px-4 py-3 border"
                  style={{ backgroundColor: theme.surface, borderColor: theme.border, opacity: booking ? 0.6 : 1 }}
                >
                  <Text style={{ color: theme.textPrimary }} className="text-sm font-semibold">
                    {new Date(slot).toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' })}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          )}
        </View>
      </ScrollView>
    </View>
  );
}