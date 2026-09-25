// import { useChat } from "@ai-sdk/react";
// import { DefaultChatTransport } from "ai";
// import { fetch as expoFetch } from "expo/fetch";
// import { useState, useRef, useEffect, useCallback, useMemo, Key } from "react";
// import {
//   View,
//   Text,
//   TextInput,
//   Pressable,
//   ScrollView,
//   KeyboardAvoidingView,
//   Platform,
//   Animated,
//   Dimensions,
//   ActivityIndicator,
// } from "react-native";
// import { LinearGradient } from "expo-linear-gradient";
// import { Ionicons } from "@expo/vector-icons";
// import * as Clipboard from "expo-clipboard";
// import * as Haptics from "expo-haptics";
// import AsyncStorage from "@react-native-async-storage/async-storage";

// import { useTheme } from "../../src/theme/ThemeContext";

// const { height: SCREEN_H } = Dimensions.get("window");
// const PANEL_HEIGHT = Math.min(SCREEN_H * 0.75, 620);

// const BASE_URL = "https://habeeb-innovative-s3mh-backend.vercel.app";
// const CHAT_ENDPOINT = `${BASE_URL}/api/chat`;

// const SUGGESTED_QUESTIONS = [
//   "How do I add a new transaction?",
//   "How do I check my spending by category?",
//   "How do I set a monthly budget?",
//   "How do I export my transaction history?",
// ];

// function randomId(prefix) {
//   return `${prefix}_${Date.now()}_${Math.random().toString(36).slice(2)}`;
// }

// async function getOrCreateUserId() {
//   const KEY = "nairawise_ai_user_id";
//   let id = await AsyncStorage.getItem(KEY);
//   if (!id) {
//     id = randomId("user");
//     await AsyncStorage.setItem(KEY, id);
//   }
//   return id;
// }

// function formatTime(date) {
//   return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
// }

// export default function NairaWiseAIChat() {
//   const { theme, isDark } = useTheme();

//   const [isOpen, setIsOpen] = useState(false);
//   const [input, setInput] = useState("");
//   const [copiedIndex, setCopiedIndex] = useState(null);
//   const [userId, setUserId] = useState(null);

//   const scrollRef = useRef(null);
//   const inputRef = useRef(null);
//   const conversationIdRef = useRef(randomId("conv"));
//   const messageTimesRef = useRef({});

//   const anim = useRef(new Animated.Value(0)).current;
//   const pulse = useRef(new Animated.Value(1)).current;

//   useEffect(() => {
//     (async () => {
//       setUserId(await getOrCreateUserId());
//     })();
//   }, []);

//   const transport = useMemo(
//     () =>
//       new DefaultChatTransport({
//         api: CHAT_ENDPOINT,
//         fetch: expoFetch,
//         body: () => ({
//           conversationId: conversationIdRef.current,
//           userId,
//         }),
//       }),
//     [userId]
//   );

//   const { messages, sendMessage, status, error } = useChat({ transport });

//   const isLoading = status !== "ready";

//   useEffect(() => {
//     let changed = false;
//     for (const m of messages) {
//       if (!messageTimesRef.current[m.id]) {
//         messageTimesRef.current[m.id] = new Date();
//         changed = true;
//       }
//     }
//     if (changed) scrollToBottom();
//   }, [messages]);

//   useEffect(() => {
//     if (isOpen) return;
//     const loop = Animated.loop(
//       Animated.sequence([
//         Animated.timing(pulse, { toValue: 1.4, duration: 900, useNativeDriver: true }),
//         Animated.timing(pulse, { toValue: 1, duration: 900, useNativeDriver: true }),
//       ])
//     );
//     loop.start();
//     return () => loop.stop();
//   }, [isOpen]);

//   const openPanel = () => {
//     Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
//     setIsOpen(true);
//     Animated.spring(anim, { toValue: 1, useNativeDriver: true, damping: 16, stiffness: 180 }).start(
//       () => setTimeout(() => inputRef.current?.focus(), 150)
//     );
//   };

//   const closePanel = () => {
//     Animated.timing(anim, { toValue: 0, duration: 200, useNativeDriver: true }).start(() =>
//       setIsOpen(false)
//     );
//   };

//   const scrollToBottom = useCallback(() => {
//     setTimeout(() => scrollRef.current?.scrollToEnd({ animated: true }), 80);
//   }, []);

//   const handleCopy = async (text, index) => {
//     await Clipboard.setStringAsync(text);
//     Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
//     setCopiedIndex(index);
//     setTimeout(() => setCopiedIndex((c) => (c === index ? null : c)), 1500);
//   };

//   const handleSend = (text) => {
//     const trimmed = text.trim();
//     if (!trimmed || isLoading || !userId) return;
//     Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
//     sendMessage({ text: trimmed });
//     setInput("");
//     scrollToBottom();
//   };

//   const translateY = anim.interpolate({ inputRange: [0, 1], outputRange: [40, 0] });
//   const opacity = anim;
//   const fabOpacity = anim.interpolate({ inputRange: [0, 1], outputRange: [1, 0] });
//   const fabScale = anim.interpolate({ inputRange: [0, 1], outputRange: [1, 0.6] });

//   // Theme-driven surfaces, mapped onto the same structural roles the
//   // original NAVY/PANEL/BORDER/GOLD/INDIGO/SLATE/CREAM palette played.
//   const panelBg = theme.surface;
//   const chatBg = theme.background;
//   const borderColor = theme.border;
//   const accent = theme.primary; // gold-equivalent on login screen
//   const accentOn = theme.onPrimary;
//   const secondaryAccent = theme.income ?? theme.primary; // indigo-equivalent
//   const textPrimary = theme.textPrimary;
//   const textSecondary = theme.textSecondary;
//   const textMuted = theme.textMuted;
//   const bubbleAssistantBg = isDark ? "#1B2A4A" : theme.surface;
//   const inputBg = isDark ? "#0F1830" : (theme.background === "#FFFFFF" ? "#F2F3F7" : theme.surface);

//   return (
//     <>
//       {/* Floating Action Button */}
//       <Animated.View
//         pointerEvents={isOpen ? "none" : "auto"}
//         style={{
//           position: "absolute",
//           bottom: 88,
//           right: 20,
//           opacity: fabOpacity,
//           transform: [{ scale: fabScale }],
//           zIndex: 60,
//         }}
//       >
//         <Pressable onPress={openPanel}>
//           <LinearGradient
//             colors={[secondaryAccent, theme.background === "#FFFFFF" ? "#111827" : theme.background]}
//             start={{ x: 0, y: 0 }}
//             end={{ x: 1, y: 1 }}
//             style={{
//               width: 58,
//               height: 58,
//               borderRadius: 29,
//               alignItems: "center",
//               justifyContent: "center",
//               shadowColor: secondaryAccent,
//               shadowOpacity: 0.45,
//               shadowRadius: 14,
//               shadowOffset: { width: 0, height: 6 },
//               elevation: 8,
//             }}
//           >
//             <Animated.View
//               style={{
//                 position: "absolute",
//                 top: 6,
//                 right: 6,
//                 width: 9,
//                 height: 9,
//                 borderRadius: 5,
//                 backgroundColor: accent,
//                 transform: [{ scale: pulse }],
//               }}
//             />
//             <Ionicons name="sparkles" size={24} color="#fff" />
//           </LinearGradient>
//         </Pressable>
//       </Animated.View>

//       {/* Chat Panel */}
//       {isOpen && (
//         <Animated.View
//           style={{
//             position: "absolute",
//             bottom: 24,
//             right: 16,
//             left: 16,
//             height: PANEL_HEIGHT,
//             opacity,
//             transform: [{ translateY }],
//             zIndex: 70,
//           }}
//         >
//           <KeyboardAvoidingView
//             behavior={Platform.OS === "ios" ? "padding" : undefined}
//             style={{ flex: 1 }}
//           >
//             <View
//               style={{
//                 flex: 1,
//                 backgroundColor: panelBg,
//                 borderRadius: 28,
//                 overflow: "hidden",
//                 borderWidth: 1,
//                 borderColor: borderColor,
//                 shadowColor: "#000",
//                 shadowOpacity: 0.4,
//                 shadowRadius: 24,
//                 shadowOffset: { width: 0, height: 12 },
//                 elevation: 16,
//               }}
//             >
//               {/* Header */}
//               <LinearGradient
//                 colors={[theme.background === "#FFFFFF" ? "#111827" : theme.background, secondaryAccent]}
//                 start={{ x: 0, y: 0 }}
//                 end={{ x: 1, y: 0 }}
//                 style={{
//                   flexDirection: "row",
//                   alignItems: "center",
//                   justifyContent: "space-between",
//                   paddingHorizontal: 18,
//                   paddingVertical: 16,
//                 }}
//               >
//                 <View style={{ flexDirection: "row", alignItems: "center", gap: 10 }}>
//                   <View
//                     style={{
//                       width: 38,
//                       height: 38,
//                       borderRadius: 14,
//                       backgroundColor: accent,
//                       alignItems: "center",
//                       justifyContent: "center",
//                     }}
//                   >
//                     <Ionicons name="hardware-chip-outline" size={18} color={accentOn} />
//                   </View>
//                   <View>
//                     <Text style={{ color: "#fff", fontSize: 14, fontWeight: "700" }}>
//                       NairaWise AI
//                     </Text>
//                     <View style={{ flexDirection: "row", alignItems: "center", gap: 4, marginTop: 1 }}>
//                       <View style={{ width: 6, height: 6, borderRadius: 3, backgroundColor: theme.income ?? "#3FAE7A" }} />
//                       <Text style={{ color: "rgba(255,255,255,0.7)", fontSize: 11 }}>
//                         Always here to help
//                       </Text>
//                     </View>
//                   </View>
//                 </View>
//                 <Pressable
//                   onPress={closePanel}
//                   hitSlop={10}
//                   style={{
//                     width: 32,
//                     height: 32,
//                     borderRadius: 16,
//                     backgroundColor: "rgba(255,255,255,0.15)",
//                     alignItems: "center",
//                     justifyContent: "center",
//                   }}
//                 >
//                   <Ionicons name="close" size={17} color="#fff" />
//                 </Pressable>
//               </LinearGradient>

//               {/* Messages */}
//               <ScrollView
//                 ref={scrollRef}
//                 style={{ flex: 1, backgroundColor: chatBg }}
//                 contentContainerStyle={{ padding: 16, gap: 14 }}
//                 showsVerticalScrollIndicator={false}
//               >
//                 {messages.length === 0 && (
//                   <View style={{ gap: 14 }}>
//                     <View style={{ alignItems: "center", paddingVertical: 12 }}>
//                       <LinearGradient
//                         colors={[accent, isDark ? "#B8912E" : accent]}
//                         style={{
//                           width: 56,
//                           height: 56,
//                           borderRadius: 18,
//                           alignItems: "center",
//                           justifyContent: "center",
//                           marginBottom: 12,
//                         }}
//                       >
//                         <Ionicons name="sparkles" size={26} color={accentOn} />
//                       </LinearGradient>
//                       <Text style={{ color: textPrimary, fontSize: 15, fontWeight: "700" }}>
//                         Hi! How can I help?
//                       </Text>
//                       <Text style={{ color: textSecondary, fontSize: 12, marginTop: 4, textAlign: "center" }}>
//                         Ask me anything about NairaWise, or try one of these:
//                       </Text>
//                     </View>

//                     <View style={{ gap: 8 }}>
//                       {SUGGESTED_QUESTIONS.map((q, i) => (
//                         <Pressable
//                           key={i}
//                           onPress={() => handleSend(q)}
//                           style={{
//                             paddingHorizontal: 14,
//                             paddingVertical: 12,
//                             borderRadius: 16,
//                             backgroundColor: theme.surface,
//                             borderWidth: 1,
//                             borderColor: borderColor,
//                           }}
//                         >
//                           <Text style={{ color: textPrimary, fontSize: 13 }}>{q}</Text>
//                         </Pressable>
//                       ))}
//                     </View>
//                   </View>
//                 )}

//                 {messages.map((msg, i) => {
//                   const isUser = msg.role === "user";
//                   const isCopied = copiedIndex === i;
//                   const text = msg.parts
//                     ?.filter((p) => p.type === "text")
//                     .map((p) => p.text)
//                     .join("") ?? "";
//                   const time = messageTimesRef.current[msg.id] ?? new Date();

//                   if (!text) return null;

//                   return (
//                     <View
//                       key={msg.id}
//                       style={{
//                         flexDirection: "row",
//                         justifyContent: isUser ? "flex-end" : "flex-start",
//                         gap: 8,
//                       }}
//                     >
//                       {!isUser && (
//                         <View
//                           style={{
//                             width: 26,
//                             height: 26,
//                             borderRadius: 13,
//                             backgroundColor: bubbleAssistantBg,
//                             alignItems: "center",
//                             justifyContent: "center",
//                           }}
//                         >
//                           <Ionicons name="hardware-chip-outline" size={13} color={accent} />
//                         </View>
//                       )}

//                       <Pressable
//                         onLongPress={() => handleCopy(text, i)}
//                         style={{ maxWidth: "78%" }}
//                       >
//                         <Text
//                           style={{
//                             fontSize: 10,
//                             color: isUser ? secondaryAccent : textMuted,
//                             marginBottom: 3,
//                             marginLeft: isUser ? 0 : 2,
//                             textAlign: isUser ? "right" : "left",
//                           }}
//                         >
//                           {isUser ? "You" : "NairaWise AI"}
//                         </Text>
//                         <View
//                           style={{
//                             paddingHorizontal: 14,
//                             paddingVertical: 10,
//                             borderRadius: 18,
//                             borderBottomRightRadius: isUser ? 4 : 18,
//                             borderBottomLeftRadius: isUser ? 18 : 4,
//                             backgroundColor: isUser ? secondaryAccent : bubbleAssistantBg,
//                             borderWidth: isUser ? 0 : 1,
//                             borderColor: borderColor,
//                           }}
//                         >
//                           <Text
//                             style={{
//                               fontSize: 13.5,
//                               lineHeight: 19,
//                               color: isUser ? "#fff" : textPrimary,
//                             }}
//                           >
//                             {text}
//                           </Text>
//                         </View>
//                         <View
//                           style={{
//                             flexDirection: "row",
//                             alignItems: "center",
//                             gap: 4,
//                             marginTop: 3,
//                             justifyContent: isUser ? "flex-end" : "flex-start",
//                           }}
//                         >
//                           <Text style={{ fontSize: 9.5, color: textMuted }}>{formatTime(time)}</Text>
//                           {isCopied && (
//                             <Text style={{ fontSize: 9.5, color: theme.income ?? "#3FAE7A", fontWeight: "600" }}>
//                               · Copied
//                             </Text>
//                           )}
//                         </View>
//                       </Pressable>

//                       {isUser && (
//                         <View
//                           style={{
//                             width: 26,
//                             height: 26,
//                             borderRadius: 13,
//                             backgroundColor: accent,
//                             alignItems: "center",
//                             justifyContent: "center",
//                           }}
//                         >
//                           <Ionicons name="person" size={13} color={accentOn} />
//                         </View>
//                       )}
//                     </View>
//                   );
//                 })}

//                 {isLoading && (
//                   <View style={{ flexDirection: "row", gap: 8 }}>
//                     <View
//                       style={{
//                         width: 26,
//                         height: 26,
//                         borderRadius: 13,
//                         backgroundColor: bubbleAssistantBg,
//                         alignItems: "center",
//                         justifyContent: "center",
//                       }}
//                     >
//                       <Ionicons name="hardware-chip-outline" size={13} color={accent} />
//                     </View>
//                     <View
//                       style={{
//                         backgroundColor: bubbleAssistantBg,
//                         borderWidth: 1,
//                         borderColor: borderColor,
//                         borderRadius: 18,
//                         borderBottomLeftRadius: 4,
//                         paddingHorizontal: 16,
//                         paddingVertical: 12,
//                       }}
//                     >
//                       <ActivityIndicator size="small" color={accent} />
//                     </View>
//                   </View>
//                 )}
//               </ScrollView>

//               {/* Error banner */}
//               {!!error && (
//                 <View
//                   style={{
//                     flexDirection: "row",
//                     alignItems: "center",
//                     justifyContent: "space-between",
//                     paddingHorizontal: 16,
//                     paddingVertical: 8,
//                     backgroundColor: isDark ? "#3B1418" : "#FDECEC",
//                     borderTopWidth: 1,
//                     borderTopColor: isDark ? "#5C1F26" : "#F4B9B9",
//                   }}
//                 >
//                   <Text style={{ color: isDark ? "#F5A3A3" : "#B42318", fontSize: 11, flex: 1 }}>
//                     Sorry, I'm having trouble responding right now. Please try again in a moment.
//                   </Text>
//                 </View>
//               )}

//               {/* Input */}
//               <View
//                 style={{
//                   flexDirection: "row",
//                   alignItems: "center",
//                   gap: 8,
//                   paddingHorizontal: 14,
//                   paddingVertical: 12,
//                   borderTopWidth: 1,
//                   borderTopColor: borderColor,
//                   backgroundColor: panelBg,
//                 }}
//               >
//                 <TextInput
//                   ref={inputRef}
//                   value={input}
//                   onChangeText={setInput}
//                   placeholder="Type your question..."
//                   placeholderTextColor={textMuted}
//                   editable={!isLoading}
//                   onSubmitEditing={() => handleSend(input)}
//                   returnKeyType="send"
//                   style={{
//                     flex: 1,
//                     backgroundColor: inputBg,
//                     borderRadius: 999,
//                     paddingHorizontal: 16,
//                     paddingVertical: 10,
//                     color: textPrimary,
//                     fontSize: 13.5,
//                   }}
//                 />
//                 <Pressable
//                   onPress={() => handleSend(input)}
//                   disabled={isLoading || !input.trim()}
//                   style={{
//                     width: 40,
//                     height: 40,
//                     borderRadius: 20,
//                     alignItems: "center",
//                     justifyContent: "center",
//                     backgroundColor: input.trim() && !isLoading ? secondaryAccent : borderColor,
//                   }}
//                 >
//                   <Ionicons name="send" size={16} color="#fff" />
//                 </Pressable>
//               </View>
//             </View>
//           </KeyboardAvoidingView>
//         </Animated.View>
//       )}
//     </>
//   );
// }



import { useChat } from "@ai-sdk/react";
import { DefaultChatTransport } from "ai";
import { fetch as expoFetch } from "expo/fetch";
import { useState, useRef, useEffect, useCallback, useMemo } from "react";
import {
  View,
  Text,
  TextInput,
  Pressable,
  ScrollView,
  Platform,
  Animated,
  Dimensions,
  ActivityIndicator,
  Keyboard,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons } from "@expo/vector-icons";
import * as Clipboard from "expo-clipboard";
import * as Haptics from "expo-haptics";
import AsyncStorage from "@react-native-async-storage/async-storage";

import { useTheme } from "../../src/theme/ThemeContext";

const { height: SCREEN_H } = Dimensions.get("window");
const PANEL_HEIGHT = Math.min(SCREEN_H * 0.75, 620);

const BASE_URL = "https://habeeb-innovative-s3mh-backend.vercel.app";
const CHAT_ENDPOINT = `${BASE_URL}/api/chat`;

const SUGGESTED_QUESTIONS = [
  "How do I add a new transaction?",
  "How do I check my spending by category?",
  "How do I set a monthly budget?",
  "How do I export my transaction history?",
];

function randomId(prefix) {
  return `${prefix}_${Date.now()}_${Math.random().toString(36).slice(2)}`;
}

async function getOrCreateUserId() {
  const KEY = "nairawise_ai_user_id";
  let id = await AsyncStorage.getItem(KEY);
  if (!id) {
    id = randomId("user");
    await AsyncStorage.setItem(KEY, id);
  }
  return id;
}

function formatTime(date) {
  return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
}

export default function NairaWiseAIChat() {
  const { theme, isDark } = useTheme();

  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState("");
  const [copiedIndex, setCopiedIndex] = useState(null);
  const [userId, setUserId] = useState(null);
  const [keyboardHeight, setKeyboardHeight] = useState(0);

  const scrollRef = useRef(null);
  const inputRef = useRef(null);
  const conversationIdRef = useRef(randomId("conv"));
  const messageTimesRef = useRef({});

  const anim = useRef(new Animated.Value(0)).current;
  const pulse = useRef(new Animated.Value(1)).current;

  const scrollToBottom = useCallback(() => {
    setTimeout(() => scrollRef.current?.scrollToEnd({ animated: true }), 80);
  }, []);

  useEffect(() => {
    (async () => {
      setUserId(await getOrCreateUserId());
    })();
  }, []);

  // Track keyboard height directly so we can shift the whole (absolutely
  // positioned, fixed-height) panel up ourselves — KeyboardAvoidingView
  // doesn't reliably affect absolute-positioned siblings, especially on Android.
  useEffect(() => {
    const showEvent = Platform.OS === "ios" ? "keyboardWillShow" : "keyboardDidShow";
    const hideEvent = Platform.OS === "ios" ? "keyboardWillHide" : "keyboardDidHide";

    const showSub = Keyboard.addListener(showEvent, (e) => {
      setKeyboardHeight(e.endCoordinates?.height ?? 0);
      scrollToBottom();
    });
    const hideSub = Keyboard.addListener(hideEvent, () => setKeyboardHeight(0));

    return () => {
      showSub.remove();
      hideSub.remove();
    };
  }, [scrollToBottom]);

  const transport = useMemo(
    () =>
      new DefaultChatTransport({
        api: CHAT_ENDPOINT,
        fetch: expoFetch,
        body: () => ({
          conversationId: conversationIdRef.current,
          userId,
        }),
      }),
    [userId]
  );

  const { messages, sendMessage, status, error } = useChat({ transport });

  const isLoading = status !== "ready";

  useEffect(() => {
    let changed = false;
    for (const m of messages) {
      if (!messageTimesRef.current[m.id]) {
        messageTimesRef.current[m.id] = new Date();
        changed = true;
      }
    }
    if (changed) scrollToBottom();
  }, [messages, scrollToBottom]);

  useEffect(() => {
    if (isOpen) return;
    const loop = Animated.loop(
      Animated.sequence([
        Animated.timing(pulse, { toValue: 1.4, duration: 900, useNativeDriver: true }),
        Animated.timing(pulse, { toValue: 1, duration: 900, useNativeDriver: true }),
      ])
    );
    loop.start();
    return () => loop.stop();
  }, [isOpen, pulse]);

  const openPanel = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    setIsOpen(true);
    Animated.spring(anim, { toValue: 1, useNativeDriver: true, damping: 16, stiffness: 180 }).start(
      () => setTimeout(() => inputRef.current?.focus(), 150)
    );
  };

  const closePanel = () => {
    Keyboard.dismiss();
    Animated.timing(anim, { toValue: 0, duration: 200, useNativeDriver: true }).start(() =>
      setIsOpen(false)
    );
  };

  const handleCopy = async (text, index) => {
    await Clipboard.setStringAsync(text);
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    setCopiedIndex(index);
    setTimeout(() => setCopiedIndex((c) => (c === index ? null : c)), 1500);
  };

  const handleSend = (text) => {
    const trimmed = text.trim();
    if (!trimmed || isLoading || !userId) return;
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    sendMessage({ text: trimmed });
    setInput("");
    scrollToBottom();
  };

  const translateY = anim.interpolate({ inputRange: [0, 1], outputRange: [40, 0] });
  const opacity = anim;
  const fabOpacity = anim.interpolate({ inputRange: [0, 1], outputRange: [1, 0] });
  const fabScale = anim.interpolate({ inputRange: [0, 1], outputRange: [1, 0.6] });

  // Theme-driven surfaces, mapped onto the same structural roles the
  // original NAVY/PANEL/BORDER/GOLD/INDIGO/SLATE/CREAM palette played.
  const panelBg = theme.surface;
  const chatBg = theme.background;
  const borderColor = theme.border;
  const accent = theme.primary; // gold-equivalent on login screen
  const accentOn = theme.onPrimary;
  const secondaryAccent = theme.income ?? theme.primary; // indigo-equivalent
  const textPrimary = theme.textPrimary;
  const textSecondary = theme.textSecondary;
  const textMuted = theme.textMuted;
  const bubbleAssistantBg = isDark ? "#1B2A4A" : theme.surface;
  const inputBg = isDark ? "#0F1830" : (theme.background === "#FFFFFF" ? "#F2F3F7" : theme.surface);

  // When the keyboard is up, shift the panel above it and clamp its height
  // so the header never gets pushed off the top of shorter screens.
  const panelBottom = 24 + keyboardHeight;
  const panelHeight =
    keyboardHeight > 0 ? Math.min(PANEL_HEIGHT, SCREEN_H - keyboardHeight - 40) : PANEL_HEIGHT;

  return (
    <>
      {/* Floating Action Button */}
      <Animated.View
        pointerEvents={isOpen ? "none" : "auto"}
        style={{
          position: "absolute",
          bottom: 88,
          right: 20,
          opacity: fabOpacity,
          transform: [{ scale: fabScale }],
          zIndex: 60,
        }}
      >
        <Pressable onPress={openPanel}>
          <LinearGradient
            colors={[secondaryAccent, theme.background === "#FFFFFF" ? "#111827" : theme.background]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={{
              width: 58,
              height: 58,
              borderRadius: 29,
              alignItems: "center",
              justifyContent: "center",
              shadowColor: secondaryAccent,
              shadowOpacity: 0.45,
              shadowRadius: 14,
              shadowOffset: { width: 0, height: 6 },
              elevation: 8,
            }}
          >
            <Animated.View
              style={{
                position: "absolute",
                top: 6,
                right: 6,
                width: 9,
                height: 9,
                borderRadius: 5,
                backgroundColor: accent,
                transform: [{ scale: pulse }],
              }}
            />
            <Ionicons name="sparkles" size={24} color="#fff" />
          </LinearGradient>
        </Pressable>
      </Animated.View>

      {/* Chat Panel */}
      {isOpen && (
        <Animated.View
          style={{
            position: "absolute",
            bottom: panelBottom,
            right: 16,
            left: 16,
            height: panelHeight,
            opacity,
            transform: [{ translateY }],
            zIndex: 70,
          }}
        >
          <View
            style={{
              flex: 1,
              backgroundColor: panelBg,
              borderRadius: 28,
              overflow: "hidden",
              borderWidth: 1,
              borderColor: borderColor,
              shadowColor: "#000",
              shadowOpacity: 0.4,
              shadowRadius: 24,
              shadowOffset: { width: 0, height: 12 },
              elevation: 16,
            }}
          >
            {/* Header */}
            <LinearGradient
              colors={[theme.background === "#FFFFFF" ? "#111827" : theme.background, secondaryAccent]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={{
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "space-between",
                paddingHorizontal: 18,
                paddingVertical: 16,
              }}
            >
              <View style={{ flexDirection: "row", alignItems: "center", gap: 10 }}>
                <View
                  style={{
                    width: 38,
                    height: 38,
                    borderRadius: 14,
                    backgroundColor: accent,
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <Ionicons name="hardware-chip-outline" size={18} color={accentOn} />
                </View>
                <View>
                  <Text style={{ color: "#fff", fontSize: 14, fontWeight: "700" }}>
                    NairaWise AI
                  </Text>
                  <View style={{ flexDirection: "row", alignItems: "center", gap: 4, marginTop: 1 }}>
                    <View style={{ width: 6, height: 6, borderRadius: 3, backgroundColor: theme.income ?? "#3FAE7A" }} />
                    <Text style={{ color: "rgba(255,255,255,0.7)", fontSize: 11 }}>
                      Always here to help
                    </Text>
                  </View>
                </View>
              </View>
              <Pressable
                onPress={closePanel}
                hitSlop={10}
                style={{
                  width: 32,
                  height: 32,
                  borderRadius: 16,
                  backgroundColor: "rgba(255,255,255,0.15)",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <Ionicons name="close" size={17} color="#fff" />
              </Pressable>
            </LinearGradient>

            {/* Messages */}
            <ScrollView
              ref={scrollRef}
              style={{ flex: 1, backgroundColor: chatBg }}
              contentContainerStyle={{ padding: 16, gap: 14 }}
              showsVerticalScrollIndicator={false}
              keyboardShouldPersistTaps="handled"
            >
              {messages.length === 0 && (
                <View style={{ gap: 14 }}>
                  <View style={{ alignItems: "center", paddingVertical: 12 }}>
                    <LinearGradient
                      colors={[accent, isDark ? "#B8912E" : accent]}
                      style={{
                        width: 56,
                        height: 56,
                        borderRadius: 18,
                        alignItems: "center",
                        justifyContent: "center",
                        marginBottom: 12,
                      }}
                    >
                      <Ionicons name="sparkles" size={26} color={accentOn} />
                    </LinearGradient>
                    <Text style={{ color: textPrimary, fontSize: 15, fontWeight: "700" }}>
                      Hi! How can I help?
                    </Text>
                    <Text style={{ color: textSecondary, fontSize: 12, marginTop: 4, textAlign: "center" }}>
                      Ask me anything about NairaWise, or try one of these:
                    </Text>
                  </View>

                  <View style={{ gap: 8 }}>
                    {SUGGESTED_QUESTIONS.map((q, i) => (
                      <Pressable
                        key={i}
                        onPress={() => handleSend(q)}
                        style={{
                          paddingHorizontal: 14,
                          paddingVertical: 12,
                          borderRadius: 16,
                          backgroundColor: theme.surface,
                          borderWidth: 1,
                          borderColor: borderColor,
                        }}
                      >
                        <Text style={{ color: textPrimary, fontSize: 13 }}>{q}</Text>
                      </Pressable>
                    ))}
                  </View>
                </View>
              )}

              {messages.map((msg, i) => {
                const isUser = msg.role === "user";
                const isCopied = copiedIndex === i;
                const text = msg.parts
                  ?.filter((p) => p.type === "text")
                  .map((p) => p.text)
                  .join("") ?? "";
                const time = messageTimesRef.current[msg.id] ?? new Date();

                if (!text) return null;

                return (
                  <View
                    key={msg.id}
                    style={{
                      flexDirection: "row",
                      justifyContent: isUser ? "flex-end" : "flex-start",
                      gap: 8,
                    }}
                  >
                    {!isUser && (
                      <View
                        style={{
                          width: 26,
                          height: 26,
                          borderRadius: 13,
                          backgroundColor: bubbleAssistantBg,
                          alignItems: "center",
                          justifyContent: "center",
                        }}
                      >
                        <Ionicons name="hardware-chip-outline" size={13} color={accent} />
                      </View>
                    )}

                    <Pressable
                      onLongPress={() => handleCopy(text, i)}
                      style={{ maxWidth: "78%" }}
                    >
                      <Text
                        style={{
                          fontSize: 10,
                          color: isUser ? secondaryAccent : textMuted,
                          marginBottom: 3,
                          marginLeft: isUser ? 0 : 2,
                          textAlign: isUser ? "right" : "left",
                        }}
                      >
                        {isUser ? "You" : "NairaWise AI"}
                      </Text>
                      <View
                        style={{
                          paddingHorizontal: 14,
                          paddingVertical: 10,
                          borderRadius: 18,
                          borderBottomRightRadius: isUser ? 4 : 18,
                          borderBottomLeftRadius: isUser ? 18 : 4,
                          backgroundColor: isUser ? secondaryAccent : bubbleAssistantBg,
                          borderWidth: isUser ? 0 : 1,
                          borderColor: borderColor,
                        }}
                      >
                        <Text
                          style={{
                            fontSize: 13.5,
                            lineHeight: 19,
                            color: isUser ? "#fff" : textPrimary,
                          }}
                        >
                          {text}
                        </Text>
                      </View>
                      <View
                        style={{
                          flexDirection: "row",
                          alignItems: "center",
                          gap: 4,
                          marginTop: 3,
                          justifyContent: isUser ? "flex-end" : "flex-start",
                        }}
                      >
                        <Text style={{ fontSize: 9.5, color: textMuted }}>{formatTime(time)}</Text>
                        {isCopied && (
                          <Text style={{ fontSize: 9.5, color: theme.income ?? "#3FAE7A", fontWeight: "600" }}>
                            · Copied
                          </Text>
                        )}
                      </View>
                    </Pressable>

                    {isUser && (
                      <View
                        style={{
                          width: 26,
                          height: 26,
                          borderRadius: 13,
                          backgroundColor: accent,
                          alignItems: "center",
                          justifyContent: "center",
                        }}
                      >
                        <Ionicons name="person" size={13} color={accentOn} />
                      </View>
                    )}
                  </View>
                );
              })}

              {isLoading && (
                <View style={{ flexDirection: "row", gap: 8 }}>
                  <View
                    style={{
                      width: 26,
                      height: 26,
                      borderRadius: 13,
                      backgroundColor: bubbleAssistantBg,
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    <Ionicons name="hardware-chip-outline" size={13} color={accent} />
                  </View>
                  <View
                    style={{
                      backgroundColor: bubbleAssistantBg,
                      borderWidth: 1,
                      borderColor: borderColor,
                      borderRadius: 18,
                      borderBottomLeftRadius: 4,
                      paddingHorizontal: 16,
                      paddingVertical: 12,
                    }}
                  >
                    <ActivityIndicator size="small" color={accent} />
                  </View>
                </View>
              )}
            </ScrollView>

            {/* Error banner */}
            {!!error && (
              <View
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  justifyContent: "space-between",
                  paddingHorizontal: 16,
                  paddingVertical: 8,
                  backgroundColor: isDark ? "#3B1418" : "#FDECEC",
                  borderTopWidth: 1,
                  borderTopColor: isDark ? "#5C1F26" : "#F4B9B9",
                }}
              >
                <Text style={{ color: isDark ? "#F5A3A3" : "#B42318", fontSize: 11, flex: 1 }}>
                  Sorry, I'm having trouble responding right now. Please try again in a moment.
                </Text>
              </View>
            )}

            {/* Input */}
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                gap: 8,
                paddingHorizontal: 14,
                paddingVertical: 12,
                borderTopWidth: 1,
                borderTopColor: borderColor,
                backgroundColor: panelBg,
              }}
            >
              <TextInput
                ref={inputRef}
                value={input}
                onChangeText={setInput}
                placeholder="Type your question..."
                placeholderTextColor={textMuted}
                editable={!isLoading}
                onSubmitEditing={() => handleSend(input)}
                returnKeyType="send"
                style={{
                  flex: 1,
                  backgroundColor: inputBg,
                  borderRadius: 999,
                  paddingHorizontal: 16,
                  paddingVertical: 10,
                  color: textPrimary,
                  fontSize: 13.5,
                }}
              />
              <Pressable
                onPress={() => handleSend(input)}
                disabled={isLoading || !input.trim()}
                style={{
                  width: 40,
                  height: 40,
                  borderRadius: 20,
                  alignItems: "center",
                  justifyContent: "center",
                  backgroundColor: input.trim() && !isLoading ? secondaryAccent : borderColor,
                }}
              >
                <Ionicons name="send" size={16} color="#fff" />
              </Pressable>
            </View>
          </View>
        </Animated.View>
      )}
    </>
  );
}