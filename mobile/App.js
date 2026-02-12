import React, { useState, useEffect } from 'react';
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
  StatusBar,
  TextInput,
  Switch,
  Dimensions,
  Alert
} from 'react-native';
import {
  Shield,
  Activity,
  AlertTriangle,
  Settings as SettingsIcon,
  Bell,
  Lock,
  Unlock,
  User,
  LogOut,
  ChevronRight,
  ShieldAlert,
  ArrowLeft
} from 'lucide-react-native';
import { LinearGradient } from 'expo-linear-gradient';
import Svg, { Circle, G } from 'react-native-svg';

const { width } = Dimensions.get('window');

// API Config
const API_IP = '10.1.5.135';
const API_URL = `http://${API_IP}:8000/api`;

const App = () => {
  const [userRole, setUserRole] = useState(null); // 'student' or 'parent'
  const [userId, setUserId] = useState('');
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  // Data State
  const [studentData, setStudentData] = useState(null);
  const [loading, setLoading] = useState(false);

  // --- CORE LOGIC ---

  const refreshData = async () => {
    if (!isLoggedIn) return;
    try {
      if (userRole === 'student') {
        const res = await fetch(`${API_URL}/parent/dashboard/parent_akash`); // Demo parent link
        const data = await res.json();
        setStudentData(data);
      } else if (userRole === 'parent') {
        const res = await fetch(`${API_URL}/parent/dashboard/${userId}`);
        const data = await res.json();
        setStudentData(data);
      }
    } catch (e) {
      console.error("Sync Error:", e);
    }
  };

  useEffect(() => {
    if (isLoggedIn) {
      refreshData();
      const interval = setInterval(refreshData, 3000);
      return () => clearInterval(interval);
    }
  }, [isLoggedIn]);

  const handleUnlock = async () => {
    if (!studentData) return;
    try {
      const res = await fetch(`${API_URL}/parent/unlock-student?student_id=${studentData.student_id}`, {
        method: 'POST'
      });
      if (res.ok) {
        Alert.alert("Success", "App access restored for student.");
        refreshData();
      }
    } catch (e) {
      Alert.alert("Error", "Failed to unlock app.");
    }
  };

  // --- UI COMPONENTS ---

  const SafetyChart = ({ score }) => {
    const size = 200;
    const strokeWidth = 18;
    const radius = (size - strokeWidth) / 2;
    const circumference = radius * 2 * Math.PI;
    const strokeDashoffset = circumference - (score / 100) * circumference;
    const color = score > 70 ? '#10b981' : score > 30 ? '#f59e0b' : '#ef4444';

    return (
      <View style={styles.chartContainer}>
        <Svg width={size} height={size}>
          <G rotation="-90" origin={`${size / 2}, ${size / 2}`}>
            <Circle cx={size / 2} cy={size / 2} r={radius} stroke="rgba(255,255,255,0.05)" strokeWidth={strokeWidth} fill="transparent" />
            <Circle cx={size / 2} cy={size / 2} r={radius} stroke={color} strokeWidth={strokeWidth}
              strokeDasharray={circumference} strokeDashoffset={strokeDashoffset} strokeLinecap="round" fill="transparent" />
          </G>
        </Svg>
        <View style={styles.chartTextContainer}>
          <Text style={[styles.chartScoreText, { color }]}>{score}%</Text>
          <Text style={styles.chartSubText}>SAFETY LEVEL</Text>
        </View>
      </View>
    );
  };

  // --- VIEW: LOGIN ---
  const LoginView = () => (
    <LinearGradient colors={['#0f172a', '#1e293b']} style={styles.fullScreen}>
      <View style={styles.loginCard}>
        <Shield color="#6366f1" size={60} style={{ marginBottom: 20 }} />
        <Text style={styles.loginTitle}>CyberSafe Access</Text>
        <Text style={styles.loginSubtitle}>Select your role to continue</Text>

        <TouchableOpacity
          style={[styles.roleBtn, userRole === 'student' && styles.roleBtnActive]}
          onPress={() => setUserRole('student')}
        >
          <User color={userRole === 'student' ? '#fff' : '#64748b'} />
          <Text style={[styles.roleBtnText, userRole === 'student' && styles.roleBtnTextActive]}>I am a Student</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.roleBtn, userRole === 'parent' && styles.roleBtnActive]}
          onPress={() => setUserRole('parent')}
        >
          <ShieldAlert color={userRole === 'parent' ? '#fff' : '#64748b'} />
          <Text style={[styles.roleBtnText, userRole === 'parent' && styles.roleBtnTextActive]}>I am a Parent</Text>
        </TouchableOpacity>

        <TextInput
          style={styles.loginInput}
          placeholder="Enter ID (e.g. student_akash or parent_akash)"
          placeholderTextColor="#64748b"
          value={userId}
          onChangeText={setUserId}
        />

        <TouchableOpacity style={styles.loginSubmit} onPress={() => setIsLoggedIn(true)}>
          <Text style={styles.loginSubmitText}>Sign In</Text>
        </TouchableOpacity>
      </View>
    </LinearGradient>
  );

  // --- VIEW: STUDENT LOCK ---
  const StudentLockView = () => (
    <View style={styles.lockScreen}>
      <Lock size={100} color="#ef4444" />
      <Text style={styles.lockTitle}>Access Restricted</Text>
      <View style={styles.lockDivider} />
      <Text style={styles.lockMessage}>
        Your safety levels have dropped to 0%. This app is temporarily blocked for your protection.
      </Text>
      <Text style={styles.lockSubMessage}>
        Please speak with your parent to unlock accessibility.
      </Text>
      <TouchableOpacity
        style={styles.emergencyBtn}
        onPress={() => Alert.alert("Emergency", "Calling emergency contact...")}
      >
        <Activity color="#fff" size={20} />
        <Text style={styles.emergencyText}>Emergency Call</Text>
      </TouchableOpacity>
    </View>
  );

  // --- VIEW: PARENT DASHBOARD ---
  const ParentView = () => (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <Text style={styles.screenTitle}>Parent Dashboard</Text>
          <TouchableOpacity onPress={() => setIsLoggedIn(false)}>
            <LogOut color="#ef4444" size={24} />
          </TouchableOpacity>
        </View>

        {studentData ? (
          <>
            <View style={styles.glassCard}>
              <SafetyChart score={studentData.safety_percentage} />
              <View style={styles.statusRow}>
                <View style={[styles.statusIndicator, { backgroundColor: studentData.app_blocked ? '#ef4444' : '#10b981' }]} />
                <Text style={styles.statusLabel}>
                  Status: {studentData.app_blocked ? 'BLOCKED' : 'PROTECTED'}
                </Text>
              </View>

              {studentData.app_blocked && (
                <TouchableOpacity style={styles.unlockBtn} onPress={handleUnlock}>
                  <Unlock color="#fff" size={20} />
                  <Text style={styles.unlockBtnText}>UNLOCK STUDENT APP</Text>
                </TouchableOpacity>
              )}
            </View>

            <Text style={styles.sectionTitle}>Critical Alert History</Text>
            {studentData.alerts.length > 0 ? (
              studentData.alerts.map((alert, i) => (
                <View key={i} style={styles.alertCard}>
                  <View style={styles.alertHeader}>
                    <Text style={styles.alertApp}>{alert.app}</Text>
                    <View style={[styles.sevBadge, alert.severity === 'High' ? styles.sevHigh : styles.sevMed]}>
                      <Text style={styles.sevText}>{alert.severity}</Text>
                    </View>
                  </View>
                  <Text style={styles.alertTime}>{new Date(alert.timestamp).toLocaleString()}</Text>
                </View>
              ))
            ) : (
              <Text style={styles.emptyText}>No critical alerts found. Your child is safe.</Text>
            )}
          </>
        ) : <ActivityIndicator size="large" color="#6366f1" />}
      </ScrollView>
    </SafeAreaView>
  );

  // --- VIEW: STUDENT DASHBOARD ---
  const StudentView = () => {
    if (studentData?.app_blocked) return <StudentLockView />;

    return (
      <SafeAreaView style={styles.container}>
        <ScrollView style={styles.content}>
          <View style={styles.header}>
            <Text style={styles.screenTitle}>Student Shield</Text>
            <TouchableOpacity onPress={() => setIsLoggedIn(false)}>
              <LogOut color="#64748b" size={24} />
            </TouchableOpacity>
          </View>

          <View style={styles.glassCard}>
            <SafetyChart score={studentData?.safety_percentage || 100} />
            <Text style={styles.cardInfo}>Scan active for WhatsApp & Telegram</Text>
          </View>

          <Text style={styles.sectionTitle}>Safety Tips</Text>
          <View style={styles.tipCard}>
            <Info color="#6366f1" size={24} />
            <Text style={styles.tipText}>If someone makes you uncomfortable, tell a trusted adult immediately.</Text>
          </View>
        </ScrollView>
      </SafeAreaView>
    );
  };

  if (!isLoggedIn) return <LoginView />;
  return userRole === 'parent' ? <ParentView /> : <StudentView />;
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0f172a' },
  fullScreen: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  content: { flex: 1, padding: 20 },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 25 },
  screenTitle: { color: '#fff', fontSize: 24, fontWeight: 'bold' },
  glassCard: { backgroundColor: 'rgba(30,41,59,0.7)', borderRadius: 30, padding: 30, alignItems: 'center', borderWidth: 1, borderColor: 'rgba(255,255,255,0.1)' },
  chartContainer: { position: 'relative', justifyContent: 'center', alignItems: 'center', marginBottom: 20 },
  chartTextContainer: { position: 'absolute', alignItems: 'center' },
  chartScoreText: { fontSize: 42, fontWeight: '900' },
  chartSubText: { color: '#94a3b8', fontSize: 10, letterSpacing: 1 },
  statusRow: { flexDirection: 'row', alignItems: 'center', marginTop: 10 },
  statusIndicator: { width: 10, height: 10, borderRadius: 5, marginRight: 8 },
  statusLabel: { color: '#fff', fontWeight: 'bold', fontSize: 14 },
  unlockBtn: { backgroundColor: '#6366f1', flexDirection: 'row', padding: 16, borderRadius: 15, marginTop: 20, width: '100%', justifyContent: 'center', alignItems: 'center' },
  unlockBtnText: { color: '#fff', fontWeight: 'bold', marginLeft: 10 },
  sectionTitle: { color: '#fff', fontSize: 18, fontWeight: 'bold', marginTop: 30, marginBottom: 15 },
  alertCard: { backgroundColor: 'rgba(30,41,59,0.7)', borderRadius: 20, padding: 20, marginBottom: 12 },
  alertHeader: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 8 },
  alertApp: { color: '#fff', fontSize: 16, fontWeight: 'bold' },
  sevBadge: { paddingHorizontal: 10, paddingVertical: 4, borderRadius: 8 },
  sevHigh: { backgroundColor: 'rgba(239,68,68,0.2)' },
  sevMed: { backgroundColor: 'rgba(245,158,11,0.2)' },
  sevText: { color: '#fff', fontSize: 11, fontWeight: 'bold' },
  alertTime: { color: '#64748b', fontSize: 12 },
  emptyText: { color: '#64748b', textAlign: 'center', marginTop: 20 },
  // Login Styles
  loginCard: { width: width * 0.85, backgroundColor: 'rgba(30,41,59,0.95)', padding: 40, borderRadius: 40, alignItems: 'center' },
  loginTitle: { color: '#fff', fontSize: 28, fontWeight: 'bold', marginBottom: 10 },
  loginSubtitle: { color: '#94a3b8', marginBottom: 30 },
  roleBtn: { width: '100%', flexDirection: 'row', padding: 20, borderRadius: 20, backgroundColor: 'rgba(255,255,255,0.05)', marginBottom: 12, alignItems: 'center' },
  roleBtnActive: { backgroundColor: '#6366f1' },
  roleBtnText: { color: '#64748b', marginLeft: 15, fontWeight: 'bold' },
  roleBtnTextActive: { color: '#fff' },
  loginInput: { width: '100%', backgroundColor: 'rgba(0,0,0,0.2)', padding: 18, borderRadius: 15, color: '#fff', marginTop: 10 },
  loginSubmit: { width: '100%', backgroundColor: '#fff', padding: 18, borderRadius: 15, alignItems: 'center', marginTop: 20 },
  loginSubmitText: { color: '#0f172a', fontWeight: 'bold', fontSize: 16 },
  // Lock Screen Styles
  lockScreen: { flex: 1, backgroundColor: '#0f172a', justifyContent: 'center', alignItems: 'center', padding: 40 },
  lockTitle: { color: '#fff', fontSize: 32, fontWeight: '900', marginTop: 20 },
  lockDivider: { width: 50, height: 4, backgroundColor: '#ef4444', marginVertical: 20, borderRadius: 2 },
  lockMessage: { color: '#94a3b8', textAlign: 'center', fontSize: 16, lineHeight: 24 },
  lockSubMessage: { color: '#64748b', textAlign: 'center', fontSize: 14, marginTop: 15 },
  emergencyBtn: { flexDirection: 'row', backgroundColor: '#ef4444', paddingVertical: 18, paddingHorizontal: 30, borderRadius: 20, marginTop: 40, alignItems: 'center' },
  emergencyText: { color: '#fff', fontWeight: 'bold', fontSize: 16, marginLeft: 10 },
  tipCard: { backgroundColor: 'rgba(99,102,241,0.1)', padding: 20, borderRadius: 20, flexDirection: 'row', alignItems: 'center' },
  tipText: { color: '#94a3b8', flex: 1, marginLeft: 15, fontSize: 14, lineHeight: 20 }
});

export default App;
