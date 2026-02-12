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
  Dimensions,
  Alert,
  ActivityIndicator
} from 'react-native';
import {
  Shield,
  Activity,
  Lock,
  Unlock,
  User,
  LogOut,
  Bell,
  Settings as SettingsIcon,
  Mail,
  ArrowLeft,
  Info
} from 'lucide-react-native';
import { LinearGradient } from 'expo-linear-gradient';
import Svg, { Circle, G } from 'react-native-svg';

const { width } = Dimensions.get('window');

// API Config (Update this to your PC's actual IP address shown in ipconfig)
const API_IP = '192.168.137.1';
const BACKEND_URL = `http://${API_IP}:8000`;

// --- SUB-COMPONENTS (Defined outside to prevent input focus loss) ---

const SafetyChart = ({ score }) => {
  const size = 160;
  const strokeWidth = 14;
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
        <Text style={styles.chartSubText}>Safety</Text>
      </View>
    </View>
  );
};

const LoginView = ({ email, setEmail, password, setPassword, handleLogin, loading, setCurrentView }) => (
  <LinearGradient colors={['#0f172a', '#1e293b']} style={styles.fullScreen}>
    <View style={styles.authCard}>
      <Shield color="#6366f1" size={60} style={{ marginBottom: 20 }} />
      <Text style={styles.authTitle}>CyberSafe Login</Text>

      <View style={styles.inputGroup}>
        <Mail color="#64748b" size={20} />
        <TextInput
          style={styles.input}
          placeholder="Email Address"
          placeholderTextColor="#64748b"
          keyboardType="email-address"
          autoCapitalize="none"
          value={email}
          onChangeText={setEmail}
        />
      </View>

      <View style={styles.inputGroup}>
        <Lock color="#64748b" size={20} />
        <TextInput
          style={styles.input}
          placeholder="Password"
          placeholderTextColor="#64748b"
          secureTextEntry
          value={password}
          onChangeText={setPassword}
        />
      </View>

      <TouchableOpacity style={styles.submitBtn} onPress={handleLogin} disabled={loading}>
        {loading ? <ActivityIndicator color="#fff" /> : <Text style={styles.submitBtnText}>Sign In</Text>}
      </TouchableOpacity>

      <TouchableOpacity onPress={() => setCurrentView('register')}>
        <Text style={styles.authLink}>New to CyberSafe? <Text style={{ color: '#6366f1' }}>Register</Text></Text>
      </TouchableOpacity>
    </View>
  </LinearGradient>
);

const RegisterView = ({ role, setRole, name, setName, email, setEmail, password, setPassword, parentEmail, setParentEmail, handleRegister, loading, setCurrentView }) => (
  <LinearGradient colors={['#0f172a', '#1e293b']} style={styles.fullScreen}>
    <ScrollView contentContainerStyle={{ justifyContent: 'center', alignItems: 'center', paddingVertical: 50 }}>
      <View style={styles.authCard}>
        <TouchableOpacity onPress={() => setCurrentView('login')} style={styles.backBtn}>
          <ArrowLeft color="#64748b" size={20} />
        </TouchableOpacity>

        <Text style={styles.authTitle}>Create Account</Text>

        <View style={styles.roleSelector}>
          <TouchableOpacity style={[styles.roleOption, role === 'parent' && styles.roleActive]} onPress={() => setRole('parent')}>
            <Text style={[styles.roleText, role === 'parent' && styles.roleTextActive]}>Parent</Text>
          </TouchableOpacity>
          <TouchableOpacity style={[styles.roleOption, role === 'student' && styles.roleActive]} onPress={() => setRole('student')}>
            <Text style={[styles.roleText, role === 'student' && styles.roleTextActive]}>Student</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.inputGroup}>
          <User color="#64748b" size={20} />
          <TextInput style={styles.input} placeholder="Full Name" placeholderTextColor="#64748b" value={name} onChangeText={setName} />
        </View>

        <View style={styles.inputGroup}>
          <Mail color="#64748b" size={20} />
          <TextInput style={styles.input} placeholder="Email" placeholderTextColor="#64748b" keyboardType="email-address" autoCapitalize="none" value={email} onChangeText={setEmail} />
        </View>

        <View style={styles.inputGroup}>
          <Lock color="#64748b" size={20} />
          <TextInput style={styles.input} placeholder="Password" placeholderTextColor="#64748b" secureTextEntry value={password} onChangeText={setPassword} />
        </View>

        {role === 'student' && (
          <View style={styles.inputGroupHighlight}>
            <Mail color="#6366f1" size={20} />
            <TextInput style={styles.input} placeholder="Parent's Email" placeholderTextColor="#64748b" keyboardType="email-address" autoCapitalize="none" value={parentEmail} onChangeText={setParentEmail} />
          </View>
        )}

        <TouchableOpacity style={styles.submitBtn} onPress={handleRegister} disabled={loading}>
          {loading ? <ActivityIndicator color="#fff" /> : <Text style={styles.submitBtnText}>Complete Registration</Text>}
        </TouchableOpacity>
      </View>
    </ScrollView>
  </LinearGradient>
);

const DashboardContent = ({ user, studentData, handleUnlock, activeTab }) => {
  if (user.role === 'student' && studentData?.app_blocked) {
    return (
      <View style={styles.lockScreen}>
        <Lock size={100} color="#ef4444" />
        <Text style={styles.lockTitle}>Access Restricted</Text>
        <Text style={styles.lockMessage}>Your parent has temporarily blocked this application for your safety.</Text>
        <TouchableOpacity style={styles.emergencyBtn}><Text style={styles.emergencyText}>Emergency Call</Text></TouchableOpacity>
      </View>
    );
  }

  // Alerts History Tab
  if (activeTab === 'history') {
    return (
      <ScrollView style={styles.content}>
        <Text style={styles.sectionTitle}>{user.role === 'parent' ? "Critical Risk History" : "Safety Log"}</Text>
        {user.role === 'parent' ? (
          studentData?.alerts?.length > 0 ? (
            studentData.alerts.map((alert, i) => (
              <View key={i} style={styles.alertCard}>
                <View style={styles.alertHeader}>
                  <Text style={styles.alertApp}>{alert.app}</Text>
                  <View style={[styles.sevBadge, { backgroundColor: alert.severity === 'High' ? 'rgba(239,68,68,0.2)' : 'rgba(245,158,11,0.2)' }]}>
                    <Text style={styles.sevText}>{alert.severity}</Text>
                  </View>
                </View>
                <Text style={styles.alertTime}>{new Date(alert.timestamp).toLocaleString()}</Text>
              </View>
            ))
          ) : <Text style={{ color: '#64748b', textAlign: 'center', marginTop: 30 }}>No critical alerts detected.</Text>
        ) : (
          <View style={styles.tipCard}>
            <Info color="#6366f1" size={24} />
            <Text style={styles.tipText}>Only critical threats are recorded here for your guardian to review.</Text>
          </View>
        )}
      </ScrollView>
    );
  }

  // Settings / Setup Tab
  if (activeTab === 'settings') {
    return (
      <ScrollView style={styles.content}>
        <Text style={styles.sectionTitle}>Shield Settings</Text>
        <View style={styles.glassCard}>
          <View style={{ width: '100%', paddingVertical: 10 }}>
            <Text style={{ color: '#fff', fontWeight: 'bold' }}>AI Engine Status</Text>
            <Text style={{ color: '#10b981', fontSize: 12 }}>Active & Scanning</Text>
          </View>
          <View style={{ width: '100%', height: 1, backgroundColor: 'rgba(255,255,255,0.05)', marginVertical: 10 }} />
          <View style={{ width: '100%', paddingVertical: 10 }}>
            <Text style={{ color: '#fff', fontWeight: 'bold' }}>Social App Monitoring</Text>
            <Text style={{ color: '#64748b', fontSize: 12 }}>WhatsApp, Telegram, Messenger</Text>
          </View>
        </View>
        <Text style={{ color: '#64748b', fontSize: 12, textAlign: 'center', marginTop: 20 }}>
          Version 1.0.0 (Hackathon Build)
        </Text>
      </ScrollView>
    );
  }

  // Main Dashboard Tab
  return (
    <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
      <View style={styles.glassCard}>
        <SafetyChart score={studentData?.safety_percentage || 100} />
        <Text style={{ color: '#94a3b8', marginTop: 15 }}>
          {user.role === 'parent' ? `Monitoring Child ID: ${studentData?.student_id || '...'}` : "Shield Active on WhatsApp & Telegram"}
        </Text>

        {user.role === 'parent' && studentData?.app_blocked && (
          <TouchableOpacity style={styles.unlockBtn} onPress={handleUnlock}>
            <Unlock color="#fff" size={20} />
            <Text style={styles.unlockBtnText}>Unlock Student Device</Text>
          </TouchableOpacity>
        )}
      </View>

      <Text style={styles.sectionTitle}>Quick Status</Text>
      <View style={styles.tipCard}>
        <Shield color="#6366f1" size={24} />
        <View style={{ marginLeft: 15, flex: 1 }}>
          <Text style={{ color: '#fff', fontWeight: 'bold' }}>{user.role === 'parent' ? "Connection Active" : "Protection Running"}</Text>
          <Text style={styles.tipText}>
            {user.role === 'parent' ? "Receiving real-time safety updates." : "Messages are being scanned by on-device AI."}
          </Text>
        </View>
      </View>
    </ScrollView>
  );
};

const MainView = ({ user, studentData, activeTab, setActiveTab, setCurrentView, handleUnlock }) => (
  <SafeAreaView style={styles.container}>
    <View style={styles.topNav}>
      <View style={styles.brandRow}>
        <Shield color="#6366f1" size={28} />
        <View>
          <Text style={styles.brandText}>CyberSafe</Text>
          <Text style={{ color: '#6366f1', fontSize: 10, marginLeft: 10, fontWeight: 'bold' }}>{user.role.toUpperCase()}</Text>
        </View>
      </View>
      <TouchableOpacity onPress={() => { setCurrentView('login'); setUser(null); }}><LogOut color="#64748b" size={22} /></TouchableOpacity>
    </View>

    <DashboardContent user={user} studentData={studentData} handleUnlock={handleUnlock} activeTab={activeTab} />

    <View style={styles.bottomNav}>
      <TouchableOpacity style={styles.navItem} onPress={() => setActiveTab('dashboard')}>
        <Activity color={activeTab === 'dashboard' ? '#6366f1' : '#64748b'} size={24} />
        <Text style={[styles.navLabel, activeTab === 'dashboard' && styles.activeNavLabel]}>Safety</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.navItem} onPress={() => setActiveTab('history')}>
        <Bell color={activeTab === 'history' ? '#6366f1' : '#64748b'} size={24} />
        <Text style={[styles.navLabel, activeTab === 'history' && styles.activeNavLabel]}>Alerts</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.navItem} onPress={() => setActiveTab('settings')}>
        <SettingsIcon color={activeTab === 'settings' ? '#6366f1' : '#64748b'} size={24} />
        <Text style={[styles.navLabel, activeTab === 'settings' && styles.activeNavLabel]}>Setup</Text>
      </TouchableOpacity>
    </View>
  </SafeAreaView>
);

// --- MAIN APP COMPONENT ---

const App = () => {
  const [currentView, setCurrentView] = useState('login');
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [role, setRole] = useState('parent');
  const [parentEmail, setParentEmail] = useState('');
  const [studentData, setStudentData] = useState(null);
  const [activeTab, setActiveTab] = useState('dashboard');

  const handleRegister = async () => {
    setLoading(true);
    console.log("Attempting registration for:", email);
    try {
      const payload = { name, email, phone: '000', password, role, parent_email: role === 'student' ? parentEmail : null };
      const res = await fetch(`${BACKEND_URL}/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      if (res.ok) {
        Alert.alert("Success", "Account created! Please login.");
        setCurrentView('login');
      } else {
        const data = await res.json();
        console.log("Registration Error Detail:", data);
        Alert.alert("Error", data.detail || "Registration failed");
      }
    } catch (e) {
      console.error("Network Error during registration:", e);
      Alert.alert("Error", "Server unreachable. Check your Wi-Fi and API_IP.");
    }
    finally { setLoading(false); }
  };

  const handleLogin = async () => {
    setLoading(true);
    console.log("Attempting login for:", email);
    try {
      const res = await fetch(`${BACKEND_URL}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });
      const data = await res.json();
      if (res.ok) {
        console.log("Login successful:", data.name);
        setUser(data);
        setCurrentView('main');
      }
      else {
        console.log("Login failed:", data);
        Alert.alert("Error", data.detail || "Invalid credentials");
      }
    } catch (e) {
      console.error("Network Error during login:", e);
      Alert.alert("Error", "Server unreachable");
    }
    finally { setLoading(false); }
  };

  const syncData = async () => {
    if (!user) return;
    try {
      const res = await fetch(`${BACKEND_URL}/api/parent/dashboard/${user.user_id}`);
      if (res.ok) { setStudentData(await res.json()); }
    } catch (e) { console.log("Sync failed"); }
  };

  useEffect(() => {
    if (currentView === 'main' && user) {
      syncData();
      const interval = setInterval(syncData, 5000);
      return () => clearInterval(interval);
    }
  }, [currentView, user]);

  const handleUnlock = async () => {
    try {
      const res = await fetch(`${BACKEND_URL}/api/parent/unlock-student?student_id=${studentData.student_id}`, { method: 'POST' });
      if (res.ok) { Alert.alert("Success", "Unlocked!"); syncData(); }
    } catch (e) { Alert.alert("Error", "Unlock failed"); }
  };

  return (
    <>
      <StatusBar barStyle="light-content" />
      {currentView === 'login' && <LoginView email={email} setEmail={setEmail} password={password} setPassword={setPassword} handleLogin={handleLogin} loading={loading} setCurrentView={setCurrentView} />}
      {currentView === 'register' && <RegisterView role={role} setRole={setRole} name={name} setName={setName} email={email} setEmail={setEmail} password={password} setPassword={setPassword} parentEmail={parentEmail} setParentEmail={setParentEmail} handleRegister={handleRegister} loading={loading} setCurrentView={setCurrentView} />}
      {currentView === 'main' && user && <MainView user={user} studentData={studentData} activeTab={activeTab} setActiveTab={setActiveTab} setCurrentView={setCurrentView} handleUnlock={handleUnlock} />}
    </>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0f172a' },
  fullScreen: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  authCard: { width: width * 0.85, backgroundColor: 'rgba(30,41,59,0.8)', padding: 30, borderRadius: 30, borderWidth: 1, borderColor: 'rgba(255,255,255,0.1)' },
  authTitle: { color: '#fff', fontSize: 26, fontWeight: 'bold', textAlign: 'center', marginBottom: 25 },
  inputGroup: { flexDirection: 'row', alignItems: 'center', backgroundColor: 'rgba(0,0,0,0.2)', borderRadius: 12, paddingHorizontal: 15, marginBottom: 15 },
  inputGroupHighlight: { flexDirection: 'row', alignItems: 'center', backgroundColor: 'rgba(99,102,241,0.05)', borderRadius: 12, paddingHorizontal: 15, marginBottom: 15, borderWidth: 1, borderColor: '#6366f1', borderStyle: 'dashed' },
  input: { flex: 1, color: '#fff', padding: 15, fontSize: 14 },
  submitBtn: { backgroundColor: '#6366f1', padding: 16, borderRadius: 12, alignItems: 'center', marginTop: 10 },
  submitBtnText: { color: '#fff', fontWeight: 'bold', fontSize: 16 },
  authLink: { color: '#94a3b8', textAlign: 'center', marginTop: 20, fontSize: 13 },
  backBtn: { marginBottom: 10 },
  roleSelector: { flexDirection: 'row', gap: 10, marginBottom: 20 },
  roleOption: { flex: 1, padding: 12, borderRadius: 10, backgroundColor: 'rgba(255,255,255,0.05)', alignItems: 'center' },
  roleActive: { backgroundColor: '#6366f1' },
  roleText: { color: '#64748b', fontWeight: 'bold' },
  roleTextActive: { color: '#fff' },
  topNav: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 20, paddingTop: 50, borderBottomWidth: 1, borderBottomColor: 'rgba(255,255,255,0.05)' },
  brandRow: { flexDirection: 'row', alignItems: 'center' },
  brandText: { color: '#fff', fontSize: 20, fontWeight: '800', marginLeft: 10 },
  content: { flex: 1, padding: 20 },
  glassCard: { backgroundColor: 'rgba(30,41,59,0.7)', borderRadius: 24, padding: 24, alignItems: 'center', borderWidth: 1, borderColor: 'rgba(255,255,255,0.08)' },
  chartContainer: { justifyContent: 'center', alignItems: 'center' },
  chartTextContainer: { position: 'absolute', alignItems: 'center' },
  chartScoreText: { fontSize: 32, fontWeight: 'bold' },
  chartSubText: { color: '#94a3b8', fontSize: 10, textTransform: 'uppercase' },
  sectionTitle: { color: '#fff', fontSize: 18, fontWeight: 'bold', marginVertical: 20 },
  tipCard: { backgroundColor: 'rgba(99,102,241,0.1)', padding: 20, borderRadius: 20, flexDirection: 'row', alignItems: 'center' },
  tipText: { color: '#94a3b8', flex: 1, marginLeft: 15, fontSize: 14, lineHeight: 20 },
  bottomNav: { flexDirection: 'row', height: 80, backgroundColor: '#1e293b', paddingBottom: 20 },
  navItem: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  navLabel: { fontSize: 12, color: '#64748b', marginTop: 4 },
  activeNavLabel: { color: '#6366f1', fontWeight: 'bold' },
  lockScreen: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 40 },
  lockTitle: { color: '#fff', fontSize: 24, fontWeight: 'bold', marginTop: 20 },
  lockMessage: { color: '#94a3b8', textAlign: 'center', marginTop: 15, fontSize: 15, lineHeight: 22 },
  emergencyBtn: { backgroundColor: '#ef4444', padding: 18, borderRadius: 15, marginTop: 30, width: '100%', alignItems: 'center' },
  emergencyText: { color: '#fff', fontWeight: 'bold' },
  unlockBtn: { backgroundColor: '#6366f1', flexDirection: 'row', padding: 15, borderRadius: 12, marginTop: 20, width: '100%', justifyContent: 'center', alignItems: 'center' },
  unlockBtnText: { color: '#fff', fontWeight: 'bold', marginLeft: 10 },
  alertCard: { backgroundColor: 'rgba(30,41,59,0.7)', borderRadius: 15, padding: 15, marginBottom: 10 },
  alertHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 5 },
  alertApp: { color: '#fff', fontSize: 15, fontWeight: 'bold' },
  sevBadge: { paddingHorizontal: 8, paddingVertical: 2, borderRadius: 5 },
  sevText: { color: '#fff', fontSize: 10, fontWeight: 'bold' },
  alertTime: { color: '#64748b', fontSize: 12 }
});

export default App;
