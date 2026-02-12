import React, { useState, useEffect } from 'react';
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
  ActivityIndicator,
  StatusBar,
  TextInput,
  Switch,
  Dimensions
} from 'react-native';
import {
  Shield,
  Activity,
  AlertTriangle,
  Settings as SettingsIcon,
  Bell,
  User,
  Lock,
  Info,
  MessageCircle,
  Smartphone,
  CheckCircle2
} from 'lucide-react-native';
import { LinearGradient } from 'expo-linear-gradient';
import Svg, { Circle, G } from 'react-native-svg';

const { width } = Dimensions.get('window');

// API Service Simulation (configured for your IP)
const API_IP = '10.1.5.135';
const API_URL = `http://${API_IP}:8000/api`;

const App = () => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [loading, setLoading] = useState(false);
  const [isProtected, setIsProtected] = useState(true);
  const [safetyScore, setSafetyScore] = useState(100);

  // State for live alerts
  const [alerts, setAlerts] = useState([]);

  const [profile, setProfile] = useState({
    name: 'Akash Resi',
    age: '21',
    contact: '+91 98765 43210'
  });

  // Fetch live alerts from the backend
  const fetchAlerts = async () => {
    try {
      const response = await fetch(`${API_URL}/alerts/demo_user`);
      const data = await response.json();
      setAlerts(data);
    } catch (error) {
      console.error("Failed to fetch alerts:", error);
    }
  };

  // Poll for new alerts every 3 seconds for real-time feel
  useEffect(() => {
    fetchAlerts();
    const interval = setInterval(fetchAlerts, 3000);
    return () => clearInterval(interval);
  }, []);

  // Calculate safety score logic based on live data
  useEffect(() => {
    let score = 100;
    alerts.forEach(a => {
      if (a.severity === 'High') score -= 50;
      else if (a.severity === 'Medium') score -= 5;
    });
    setSafetyScore(Math.max(0, score));
  }, [alerts]);

  // --- UI COMPONENTS ---

  const ProgressBar = ({ progress, color }) => (
    <View style={styles.progressBg}>
      <View style={[styles.progressFill, { width: `${progress}%`, backgroundColor: color }]} />
    </View>
  );

  const CustomPieChart = ({ score }) => {
    const size = 180;
    const strokeWidth = 15;
    const radius = (size - strokeWidth) / 2;
    const circumference = radius * 2 * Math.PI;
    const strokeDashoffset = circumference - (score / 100) * circumference;
    const color = score > 70 ? '#10b981' : score > 30 ? '#f59e0b' : '#ef4444';

    return (
      <View style={styles.chartContainer}>
        <Svg width={size} height={size}>
          <G rotation="-90" origin={`${size / 2}, ${size / 2}`}>
            <Circle
              cx={size / 2}
              cy={size / 2}
              r={radius}
              stroke="rgba(255,255,255,0.05)"
              strokeWidth={strokeWidth}
              fill="transparent"
            />
            <Circle
              cx={size / 2}
              cy={size / 2}
              r={radius}
              stroke={color}
              strokeWidth={strokeWidth}
              strokeDasharray={circumference}
              strokeDashoffset={strokeDashoffset}
              strokeLinecap="round"
              fill="transparent"
            />
          </G>
        </Svg>
        <View style={styles.chartTextContainer}>
          <Text style={styles.chartScoreText}>{score}%</Text>
          <Text style={styles.chartSubText}>Safety</Text>
        </View>
      </View>
    );
  };

  const DashboardScreen = () => (
    <ScrollView style={styles.screenContent} showsVerticalScrollIndicator={false}>
      <View style={styles.headerRow}>
        <Text style={styles.screenTitle}>Safety Score</Text>
        <View style={styles.badge}>
          <Shield size={14} color="#10b981" />
          <Text style={styles.badgeText}>Live Monitoring</Text>
        </View>
      </View>

      <View style={styles.glassCard}>
        <CustomPieChart score={safetyScore} />
        <Text style={styles.cardInfoText}>
          {safetyScore > 80 ? "You're doing great! No major threats found." : "Recent threats detected. Stay alert."}
        </Text>
      </View>

      <Text style={[styles.sectionTitle, { marginTop: 25 }]}>App-wise Protection</Text>
      <View style={styles.glassCard}>
        {[
          { name: 'WhatsApp', icon: MessageCircle, color: '#25D366' },
          { name: 'Telegram', icon: Smartphone, color: '#0088cc' },
          { name: 'Other', icon: Info, color: '#6366f1' }
        ].map(app => (
          <View key={app.name} style={styles.appRow}>
            <View style={styles.appHeader}>
              <View style={styles.appIconTitle}>
                <app.icon size={18} color={app.color} />
                <Text style={styles.appName}>{app.name}</Text>
              </View>
              <Text style={styles.appPercent}>100% Safe</Text>
            </View>
            <ProgressBar progress={100} color={app.color} />
          </View>
        ))}
      </View>
    </ScrollView>
  );

  const NotificationsScreen = () => (
    <ScrollView style={styles.screenContent} showsVerticalScrollIndicator={false}>
      <Text style={styles.screenTitle}>Risk History</Text>
      {alerts.map((alert, index) => (
        <View key={alert._id || index} style={styles.alertCard}>
          <View style={styles.alertHeader}>
            <Text style={styles.alertApp}>{alert.app || 'Unknown App'} Detected</Text>
            <View style={[styles.severityBadge, styles[`severity${alert.severity}`]]}>
              <Text style={styles.severityText}>{alert.severity} Risk</Text>
            </View>
          </View>
          <Text style={styles.alertDesc}>detected cyberbullying markers in conversation.</Text>
          <Text style={styles.alertTime}>{new Date(alert.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</Text>
        </View>
      ))}
      <Text style={styles.privacyNote}>* No actual message content is ever stored.</Text>
    </ScrollView>
  );

  const SettingsScreen = () => (
    <ScrollView style={styles.screenContent} showsVerticalScrollIndicator={false}>
      <Text style={styles.screenTitle}>Settings</Text>

      <View style={styles.glassCard}>
        <View style={styles.inputGroup}>
          <Text style={styles.inputLabel}>Child Name</Text>
          <TextInput style={styles.input} value={profile.name} placeholderTextColor="#64748b" />
        </View>
        <View style={styles.inputGroup}>
          <Text style={styles.inputLabel}>Trusted Contact</Text>
          <TextInput style={styles.input} value={profile.contact} placeholderTextColor="#64748b" />
        </View>
        <TouchableOpacity style={styles.saveBtn}>
          <Text style={styles.saveBtnText}>Update Profile</Text>
        </TouchableOpacity>
      </View>

      <View style={[styles.glassCard, { marginTop: 20 }]}>
        <View style={styles.toggleRow}>
          <View>
            <Text style={styles.toggleTitle}>System Protection</Text>
            <Text style={styles.toggleDesc}>Scan apps for bullying</Text>
          </View>
          <Switch
            value={isProtected}
            onValueChange={setIsProtected}
            trackColor={{ false: "#334155", true: "#6366f1" }}
            thumbColor={"#fff"}
          />
        </View>
      </View>

      <View style={[styles.glassCard, { marginTop: 20 }]}>
        <Text style={styles.statusTitle}>Permission Status</Text>
        <View style={styles.statusRow}>
          <CheckCircle2 size={16} color="#10b981" />
          <Text style={styles.statusText}>Notification Access: Granted</Text>
        </View>
        <View style={styles.statusRow}>
          <CheckCircle2 size={16} color="#10b981" />
          <Text style={styles.statusText}>Background Service: Active</Text>
        </View>
      </View>
    </ScrollView>
  );

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" />
      <LinearGradient colors={['#0f172a', '#1e293b']} style={styles.topNav}>
        <View style={styles.brandRow}>
          <Shield color="#6366f1" size={28} />
          <Text style={styles.brandText}>CyberSafe</Text>
        </View>
      </LinearGradient>

      {activeTab === 'dashboard' && <DashboardScreen />}
      {activeTab === 'history' && <NotificationsScreen />}
      {activeTab === 'settings' && <SettingsScreen />}

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
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0f172a' },
  topNav: { padding: 20, paddingTop: 50, borderBottomWidth: 1, borderBottomColor: 'rgba(255,255,255,0.05)' },
  brandRow: { flexDirection: 'row', alignItems: 'center' },
  brandText: { color: '#fff', fontSize: 22, fontWeight: '800', marginLeft: 10 },
  screenContent: { flex: 1, padding: 20 },
  screenTitle: { color: '#fff', fontSize: 28, fontWeight: 'bold', marginBottom: 20 },
  headerRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 15 },
  badge: { flexDirection: 'row', alignItems: 'center', backgroundColor: 'rgba(16,185,129,0.1)', paddingHorizontal: 10, paddingVertical: 4, borderRadius: 20 },
  badgeText: { color: '#10b981', fontSize: 10, fontWeight: 'bold', marginLeft: 4 },
  glassCard: {
    backgroundColor: 'rgba(30,41,59,0.7)',
    borderRadius: 24,
    padding: 24,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.08)',
    alignItems: 'center'
  },
  chartContainer: { justifyContent: 'center', alignItems: 'center', marginBottom: 10 },
  chartTextContainer: { position: 'absolute', alignItems: 'center' },
  chartScoreText: { color: '#fff', fontSize: 32, fontWeight: '800' },
  chartSubText: { color: '#94a3b8', fontSize: 12, textTransform: 'uppercase' },
  cardInfoText: { color: '#94a3b8', fontSize: 14, textAlign: 'center', marginTop: 10 },
  sectionTitle: { color: '#fff', fontSize: 18, fontWeight: 'bold', marginBottom: 15 },
  appRow: { width: '100%', marginBottom: 15 },
  appHeader: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 6 },
  appIconTitle: { flexDirection: 'row', alignItems: 'center' },
  appName: { color: '#fff', marginLeft: 10, fontWeight: '600' },
  appPercent: { color: '#94a3b8', fontSize: 12 },
  progressBg: { height: 6, backgroundColor: 'rgba(255,255,255,0.05)', borderRadius: 3, overflow: 'hidden' },
  progressFill: { height: '100%', borderRadius: 3 },
  alertCard: { backgroundColor: 'rgba(30,41,59,0.7)', borderRadius: 20, padding: 16, marginBottom: 12, borderWidth: 1, borderColor: 'rgba(255,255,255,0.08)' },
  alertHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 },
  alertApp: { color: '#fff', fontSize: 16, fontWeight: 'bold' },
  severityBadge: { paddingHorizontal: 8, paddingVertical: 2, borderRadius: 6 },
  severityHigh: { backgroundColor: 'rgba(239,68,68,0.15)' },
  severityMedium: { backgroundColor: 'rgba(245,158,11,0.15)' },
  severityLow: { backgroundColor: 'rgba(16,185,129,0.15)' },
  severityText: { fontSize: 10, fontWeight: 'bold', color: '#fff' },
  alertDesc: { color: '#94a3b8', fontSize: 14, marginBottom: 10 },
  alertTime: { color: '#64748b', fontSize: 12 },
  privacyNote: { color: '#64748b', fontSize: 10, textAlign: 'center', marginVertical: 20 },
  inputGroup: { width: '100%', marginBottom: 15 },
  inputLabel: { color: '#94a3b8', fontSize: 12, marginBottom: 6 },
  input: { backgroundColor: 'rgba(0,0,0,0.2)', borderRadius: 12, padding: 12, color: '#fff', borderWidth: 1, borderColor: 'rgba(255,255,255,0.05)' },
  saveBtn: { backgroundColor: '#6366f1', width: '100%', padding: 15, borderRadius: 12, alignItems: 'center', marginTop: 10 },
  saveBtnText: { color: '#fff', fontWeight: 'bold' },
  toggleRow: { width: '100%', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  toggleTitle: { color: '#fff', fontSize: 16, fontWeight: 'bold' },
  toggleDesc: { color: '#94a3b8', fontSize: 12 },
  statusTitle: { color: '#fff', fontSize: 14, fontWeight: 'bold', marginBottom: 12, alignSelf: 'flex-start' },
  statusRow: { width: '100%', flexDirection: 'row', alignItems: 'center', marginBottom: 8 },
  statusText: { color: '#94a3b8', fontSize: 13, marginLeft: 10 },
  bottomNav: { flexDirection: 'row', height: 80, backgroundColor: '#1e293b', borderTopWidth: 1, borderTopColor: 'rgba(255,255,255,0.05)', paddingBottom: 20 },
  navItem: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  navLabel: { fontSize: 12, color: '#64748b', marginTop: 4 },
  activeNavLabel: { color: '#6366f1', fontWeight: 'bold' }
});

export default App;
