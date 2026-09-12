// src/screens/ScanReceipt.js
import { useState } from 'react';
import { View, Text, TouchableOpacity, Image, ActivityIndicator, ScrollView } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { useRouter } from 'expo-router';
import { toast } from 'sonner-native';
import { Camera, ArrowLeft } from 'lucide-react-native';
import { useTheme } from '../src/theme/ThemeContext';
import { scanReceipt, createTransaction } from '../src/api/transaction';


export default function ScanReceipt() {
  const { theme } = useTheme();
  const router = useRouter();

  const [imageUri, setImageUri] = useState(null);
  const [scanning, setScanning] = useState(false);
  const [figures, setFigures] = useState([]);
  const [selectedFigure, setSelectedFigure] = useState(null);
  const [selectedType, setSelectedType] = useState(null); // 'income' | 'expense'
  const [saving, setSaving] = useState(false);

  const takePhoto = async () => {
    const permission = await ImagePicker.requestCameraPermissionsAsync();
    if (!permission.granted) {
      toast.error('Camera permission is required to scan a receipt');
      return;
    }

    const result = await ImagePicker.launchCameraAsync({
      quality: 0.7,
      base64: false,
    });

    if (result.canceled) return;

    const uri = result.assets[0].uri;
    setImageUri(uri);
    setFigures([]);
    setSelectedFigure(null);
    setSelectedType(null);
    await runScan(uri);
  };

  const runScan = async (uri) => {
    setScanning(true);
    try {
      const formData = new FormData();
      formData.append('receipt', {
        uri,
        name: 'receipt.jpg',
        type: 'image/jpeg',
      });

      const data = await scanReceipt(formData);
      if (data.figures?.length) {
        setFigures(data.figures);
      } else {
        toast.error(data.message || 'No figures found on that receipt');
      }
    } catch (e) {
      toast.error('Could not scan the receipt. Try again.');
    } finally {
      setScanning(false);
    }
  };

  const handleConfirm = async () => {
    if (!selectedFigure || !selectedType) return;
    setSaving(true);
    try {
      await createTransaction({
        amount: selectedFigure,
        type: selectedType,
        category: 'Uncategorized',
        description: 'Added from scanned receipt',
      });
      toast.success('Transaction added');
      router.back();
    } catch (e) {
      toast.error('Could not save transaction');
    } finally {
      setSaving(false);
    }
  };

  return (
    <View style={{ flex: 1, backgroundColor: theme.background }} className="px-6 pt-16">
      <TouchableOpacity
        onPress={() => router.back()}
        className="w-10 h-10 rounded-full items-center justify-center mb-6"
        style={{ backgroundColor: theme.surface, borderWidth: 1, borderColor: theme.border }}
      >
        <ArrowLeft size={18} color={theme.textPrimary} />
      </TouchableOpacity>

      <Text style={{ color: theme.textPrimary }} className="text-2xl font-bold mb-2">
        Scan a receipt
      </Text>
      <Text style={{ color: theme.textSecondary }} className="text-sm mb-6">
        Snap a photo and we'll pull out the figures for you.
      </Text>

      {!imageUri && (
        <TouchableOpacity
          onPress={takePhoto}
          className="rounded-2xl items-center justify-center py-10 mb-6 border"
          style={{ borderColor: theme.border, backgroundColor: theme.surface }}
        >
          <Camera size={32} color={theme.primary} />
          <Text style={{ color: theme.textPrimary }} className="mt-3 font-semibold">
            Take a photo
          </Text>
        </TouchableOpacity>
      )}

      {imageUri && (
        <Image
          source={{ uri: imageUri }}
          style={{ width: '100%', height: 200, borderRadius: 16, marginBottom: 16 }}
          resizeMode="cover"
        />
      )}

      {scanning && (
        <View className="items-center py-6">
          <ActivityIndicator size="large" color={theme.primary} />
          <Text style={{ color: theme.textSecondary }} className="mt-3">
            Reading receipt...
          </Text>
        </View>
      )}

      {!scanning && figures.length > 0 && (
        <>
          <Text style={{ color: theme.textPrimary }} className="font-semibold mb-3">
            Which figure is this transaction?
          </Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} className="mb-6">
            <View className="flex-row gap-2">
              {figures.map((fig) => {
                const isSelected = selectedFigure === fig;
                return (
                  <TouchableOpacity
                    key={fig}
                    onPress={() => setSelectedFigure(fig)}
                    className="rounded-2xl px-5 py-3 border"
                    style={{
                      borderColor: isSelected ? theme.primary : theme.border,
                      backgroundColor: isSelected ? theme.primaryMuted : theme.surface,
                    }}
                  >
                    <Text
                      style={{ color: isSelected ? theme.onPrimary : theme.textPrimary }}
                      className="font-bold"
                    >
                      ₦{fig.toLocaleString()}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </View>
          </ScrollView>

          {selectedFigure && (
            <>
              <Text style={{ color: theme.textPrimary }} className="font-semibold mb-3">
                Is this income or expense?
              </Text>
              <View className="flex-row gap-3 mb-8">
                {['income', 'expense'].map((t) => {
                  const isSelected = selectedType === t;
                  return (
                    <TouchableOpacity
                      key={t}
                      onPress={() => setSelectedType(t)}
                      className="flex-1 rounded-2xl py-4 items-center border"
                      style={{
                        borderColor: isSelected ? theme.primary : theme.border,
                        backgroundColor: isSelected ? theme.primaryMuted : theme.surface,
                      }}
                    >
                      <Text
                        style={{ color: isSelected ? theme.onPrimary : theme.textPrimary }}
                        className="font-bold capitalize"
                      >
                        {t}
                      </Text>
                    </TouchableOpacity>
                  );
                })}
              </View>

              <TouchableOpacity
                onPress={handleConfirm}
                disabled={!selectedType || saving}
                className="rounded-2xl py-4 items-center"
                style={{ backgroundColor: theme.primary, opacity: !selectedType || saving ? 0.6 : 1 }}
              >
                <Text style={{ color: theme.onPrimary }} className="font-bold">
                  {saving ? 'Saving...' : 'Add transaction'}
                </Text>
              </TouchableOpacity>
            </>
          )}
        </>
      )}
    </View>
  );
}