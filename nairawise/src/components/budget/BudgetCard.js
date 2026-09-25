// import { View, Text, TouchableOpacity } from 'react-native';
// import { Pencil, Trash2, MinusCircle, Calendar } from 'lucide-react-native';
// import { useTheme } from '../../theme/ThemeContext';


// function formatMoney(amount) {
//   return `₦${Number(amount || 0).toLocaleString()}`;
// }

// export default function BudgetCard({ budget, onEdit, onDelete, onDeduct }) {
//   const { theme } = useTheme();
//   const pct = Math.min(100, Math.round((budget.spent / budget.limit) * 100));
//   const isOver = budget.spent >= budget.limit;
//   const barColor = isOver ? theme.danger || '#D14343' : pct > 75 ? '#B4780A' : theme.primary;

//   return (
//     <View
//       style={{
//         backgroundColor: theme.surface,
//         borderRadius: 16,
//         padding: 16,
//         marginBottom: 12,
//         borderWidth: 1,
//         borderColor: theme.border,
//       }}
//     >
//       <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start' }}>
//         <View style={{ flex: 1 }}>
//           <Text style={{ color: theme.text, fontWeight: '600', fontSize: 15 }}>{budget.category}</Text>
//           {budget.task ? (
//             <Text style={{ color: theme.textMuted, fontSize: 12, marginTop: 2 }}>{budget.task}</Text>
//           ) : null}
//         </View>
//         {!budget.isActive && (
//           <View style={{ backgroundColor: theme.border, borderRadius: 8, paddingHorizontal: 8, paddingVertical: 3 }}>
//             <Text style={{ fontSize: 10, color: theme.textMuted, fontWeight: '600' }}>USED UP</Text>
//           </View>
//         )}
//       </View>

//       <View style={{ marginTop: 12 }}>
//         <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 6 }}>
//           <Text style={{ color: theme.text, fontSize: 13, fontWeight: '600' }}>
//             {formatMoney(budget.spent)} <Text style={{ color: theme.textMuted, fontWeight: '400' }}>of {formatMoney(budget.limit)}</Text>
//           </Text>
//           <Text style={{ color: isOver ? (theme.danger || '#D14343') : theme.textMuted, fontSize: 12, fontWeight: '600' }}>
//             {pct}%
//           </Text>
//         </View>
//         <View style={{ height: 8, borderRadius: 4, backgroundColor: theme.background, overflow: 'hidden' }}>
//           <View style={{ height: '100%', width: `${pct}%`, backgroundColor: barColor, borderRadius: 4 }} />
//         </View>
//       </View>

//       {budget.dueDate && (
//         <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6, marginTop: 10 }}>
//           <Calendar size={13} color={theme.textMuted} />
//           <Text style={{ color: theme.textMuted, fontSize: 12 }}>
//             Due {new Date(budget.dueDate).toLocaleDateString('en-NG', { day: 'numeric', month: 'short' })}
//           </Text>
//         </View>
//       )}

//       <View style={{ flexDirection: 'row', gap: 10, marginTop: 14, borderTopWidth: 1, borderTopColor: theme.border, paddingTop: 10 }}>
//         <TouchableOpacity
//           onPress={() => onDeduct(budget)}
//           disabled={!budget.isActive}
//           style={{ flexDirection: 'row', alignItems: 'center', gap: 4, opacity: budget.isActive ? 1 : 0.4 }}
//         >
//           <MinusCircle size={15} color={theme.primary} />
//           <Text style={{ color: theme.primary, fontSize: 12, fontWeight: '600' }}>Log spend</Text>
//         </TouchableOpacity>
//         <TouchableOpacity onPress={() => onEdit(budget)} style={{ flexDirection: 'row', alignItems: 'center', gap: 4 }}>
//           <Pencil size={15} color={theme.textMuted} />
//           <Text style={{ color: theme.textMuted, fontSize: 12, fontWeight: '600' }}>Edit</Text>
//         </TouchableOpacity>
//         <TouchableOpacity onPress={() => onDelete(budget)} style={{ flexDirection: 'row', alignItems: 'center', gap: 4, marginLeft: 'auto' }}>
//           <Trash2 size={15} color={theme.danger || '#D14343'} />
//         </TouchableOpacity>
//       </View>
//     </View>
//   );
// }







import { View, Text, TouchableOpacity } from 'react-native';
import { Pencil, Trash2, MinusCircle, Calendar } from 'lucide-react-native';
import { useTheme } from '../../theme/ThemeContext';

function formatMoney(amount) {
  return `₦${Number(amount || 0).toLocaleString()}`;
}

export default function BudgetCard({ budget, onEdit, onDelete, onDeduct }) {
  const { theme, isDark } = useTheme();
  const pct = Math.min(100, Math.round((budget.spent / budget.limit) * 100));
  const isOver = budget.spent >= budget.limit;
  const barColor = isOver ? theme.danger || '#D14343' : pct > 75 ? '#B4780A' : theme.primary;

  const textColor = isDark ? '#fff' : theme.text;
  const mutedColor = isDark ? '#ccc' : theme.textMuted;

  return (
    <View
      style={{
        backgroundColor: theme.surface,
        borderRadius: 16,
        padding: 16,
        marginBottom: 12,
        borderWidth: 1,
        borderColor: theme.border,
      }}
    >
      <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <View style={{ flex: 1 }}>
          <Text style={{ color: textColor, fontWeight: '600', fontSize: 15 }}>{budget.category}</Text>
          {budget.task ? (
            <Text style={{ color: mutedColor, fontSize: 12, marginTop: 2 }}>{budget.task}</Text>
          ) : null}
        </View>
        {!budget.isActive && (
          <View style={{ backgroundColor: theme.border, borderRadius: 8, paddingHorizontal: 8, paddingVertical: 3 }}>
            <Text style={{ fontSize: 10, color: mutedColor, fontWeight: '600' }}>USED UP</Text>
          </View>
        )}
      </View>

      <View style={{ marginTop: 12 }}>
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 6 }}>
          <Text style={{ color: textColor, fontSize: 13, fontWeight: '600' }}>
            {formatMoney(budget.spent)} <Text style={{ color: mutedColor, fontWeight: '400' }}>of {formatMoney(budget.limit)}</Text>
          </Text>
          <Text style={{ color: isOver ? (theme.danger || '#D14343') : mutedColor, fontSize: 12, fontWeight: '600' }}>
            {pct}%
          </Text>
        </View>
        <View style={{ height: 8, borderRadius: 4, backgroundColor: theme.background, overflow: 'hidden' }}>
          <View style={{ height: '100%', width: `${pct}%`, backgroundColor: barColor, borderRadius: 4 }} />
        </View>
      </View>

      {budget.dueDate && (
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6, marginTop: 10 }}>
          <Calendar size={13} color={mutedColor} />
          <Text style={{ color: mutedColor, fontSize: 12 }}>
            Due {new Date(budget.dueDate).toLocaleDateString('en-NG', { day: 'numeric', month: 'short' })}
          </Text>
        </View>
      )}

      <View style={{ flexDirection: 'row', gap: 10, marginTop: 14, borderTopWidth: 1, borderTopColor: theme.border, paddingTop: 10 }}>
        <TouchableOpacity
          onPress={() => onDeduct(budget)}
          disabled={!budget.isActive}
          style={{ flexDirection: 'row', alignItems: 'center', gap: 4, opacity: budget.isActive ? 1 : 0.4 }}
        >
          <MinusCircle size={15} color={theme.primary} />
          <Text style={{ color: theme.primary, fontSize: 12, fontWeight: '600' }}>Log spend</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => onEdit(budget)} style={{ flexDirection: 'row', alignItems: 'center', gap: 4 }}>
          <Pencil size={15} color={mutedColor} />
          <Text style={{ color: mutedColor, fontSize: 12, fontWeight: '600' }}>Edit</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => onDelete(budget)} style={{ flexDirection: 'row', alignItems: 'center', gap: 4, marginLeft: 'auto' }}>
          <Trash2 size={15} color={theme.danger || '#D14343'} />
        </TouchableOpacity>
      </View>
    </View>
  );
}