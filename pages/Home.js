import React, { useState, useEffect, useMemo, useRef } from "react";
import { View, Text, StyleSheet, SafeAreaView, TouchableOpacity, ScrollView, FlatList, Alert, TextInput } from "react-native";
import { MaterialIcons } from "@expo/vector-icons";

// Data awal (Initial State)
const initialHistory = [
  { id: "1", course: "Web Programming", date: "2026-03-01", status: "Present" },
  { id: "2", course: "Database System", date: "2026-03-02", status: "Present" },
];

const Home = () => {
    
    // 1. STATE UNTUK RIWAYAT PRESENSI
    const [historyData, setHistoryData] = useState(initialHistory);
    
    // 2. STATE UNTUK STATUS TOMBOL CHECK IN
    const [isCheckedIn, setIsCheckedIn] = useState(false);
    
    // 3. STATE UNTUK JAM DIGITAL
    const [currentTime, setCurrentTime] = useState('Memuat jam...');

    // 4. STATE & REF UNTUK CATATAN (baru)
    const [note, setNote] = useState("");
    const noteInputRef = useRef(null); // Membuat "kait" kosong untuk UI

    // 5. OPTIMASI KOMPUTASI DENGAN useMemo
    const attendanceStats = useMemo(() => {
        // Teks ini hanya akan tercetak di terminal HANYA jika histotyData bertambah,
        // Bukan setiap detik saat jam berubah.
        console.log("Menghitung ulang statistik kehadiran...");

        const presentCount = historyData.filter(item => item.status === "Present").length;
        const absentCount = historyData.filter(item => item.status === "Absent").length;

        return { totalPresent: presentCount, totalAbsent: absentCount };
    }, [historyData]); // <-- Dependencies: Hanya gitung ulang kalau 'historyData' berubah
    
    // ... (Lanjut ke Langkah 3)

    // EFEK SIKLUS HIDUP (Mounting & Unmounting)
    useEffect(() => {
        // Jalankan timer setiap 1000 milidetik (1 detik)
        const timer = setInterval(() => {
            const timeString = new Date().toLocaleTimeString('id-ID', {
                hour: '2-digit', minute: '2-digit', second: '2-digit'
            });
            
            setCurrentTime(timeString);
        }, 1000);
        
        // CLEANUP: Matikan timer jika layar ditutup
        return () => clearInterval(timer);
    }, []); // Array kosong [] artinya hanya satu kali saat awal dibuka
    

    // FUNGSI LOGIKA ABSEN
    const handleCheckIn = () => {
        if (isCheckedIn) {
            Alert.alert("Perhatian", "Anda sudah melakukan Check In.");
            return;
        }

        if(note.trim() === "") {
            Alert.alert("Peringatan", "Catatan kehadiran wajib diisi!");
            return;
        }
        
        const newAttendance = {
            id: Date.now().toString(),
            course: "Mobile Programming",
            date: new Date().toLocaleDateString('id-ID'),
            status: "Present"
        };
        
        setHistoryData([newAttendance, ...historyData]);
        setIsCheckedIn(true);
        Alert.alert("Sukses", `Berhasil Check In pada pukul ${currentTime}`);
    };
    
    const renderItem = ({ item }) => (
        <View style={styles.item}>
            <View>
                <Text style={styles.course}>{item.course}</Text>
                <Text style={styles.date}>{item.date}</Text>
            </View>
            
            <View style={styles.statusRow}>
                <MaterialIcons
                    name={item.status === "Present" ? "check-circle" : "cancel"}
                    size={22}
                    color={item.status === "Present" ? "#2ecc71" : "#e74c3c"}
                />
                
                <Text style={item.status === "Present" ? styles.present : styles.absent}>
                    {item.status}
                </Text>
            </View>
        </View>
    );

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.content}>
        
        <View style={styles.headerRow}>
          <Text style={styles.title}>Attendance Apps</Text>
          <Text style={styles.clockText}>{currentTime}</Text>
        </View>

        <View style={styles.card}>
          <View style={styles.icon}>
            <MaterialIcons name="person" size={40} color="#555" />
          </View>
          <View>
            <Text style={styles.name}>Vebriana Dela Rosanti</Text>
            <Text>NIM : 0320240080</Text>
            <Text>Class : Informatika - 2A</Text>
          </View>
        </View>

        {/* Today's Class */}
        <View style={styles.classCard}>
          <Text style={styles.subtitle}>Today's Class</Text>
          <Text>Mobile Programming</Text>
          <Text>08:00 - 10:00</Text>
          <Text>Lab 3</Text>

          {/* Fitur Baru: Kolom Input Catatan dengan useRef */}
          {!isCheckedIn && (
            <TextInput
              ref={noteInputRef} // <-- Menempelkan referensi ke elemen ini
              style={styles.inputCatatan}
              placeholder="Tulis catatan (cth: Hadir lab)"
              value={note}
              onChangeText={setNote}
            />
          )}

          <TouchableOpacity
            style={[styles.button, isCheckedIn ? styles.buttonDisabled : styles.buttonActive]}
            onPress={handleCheckIn}
            disabled={isCheckedIn}
          >
            <Text style={styles.buttonText}>
              {isCheckedIn ? "CHECKED IN" : "CHECK IN"}
            </Text>
          </TouchableOpacity>
        </View>

        {/* Fitur Baru: Statistik Kehadiran (Hasil useMemo) */}
        <View style={styles.statsCard}>
          <View style={styles.statBox}>
            <Text style={styles.statNumber}>{attendanceStats.totalPresent}</Text>
            <Text style={styles.statLabel}>Total Present</Text>
          </View>
          <View style={styles.statBox}>
            <Text style={[styles.statNumber, { color: 'red' }]}>{attendanceStats.totalAbsent}</Text>
            <Text style={styles.statLabel}>Total Absent</Text>
          </View>
        </View>

        {/* Attendance History */}
        <View style={styles.classCard}>
          <Text style={styles.subtitle}>Attendance History</Text>

          <FlatList
            data={historyData} // <-- Ubah 'history' menjadi 'historyData'
            keyExtractor={(item) => item.id}
            renderItem={renderItem}
            scrollEnabled={false}
          />
        </View>

      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f2f4f7"
  },

  content: {
    padding: 20,
    paddingBottom: 40
  },

  title: {
    fontSize: 28,
    fontWeight: "bold",
    marginBottom: 20
  },

  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },

  clockText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#007AFF',
  },

  card: {
    flexDirection: "row",
    backgroundColor: "white",
    padding: 18,
    borderRadius: 12,
    marginBottom: 20,
    alignItems: "center",
  },

  icon: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: "#eee",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 15
  },

  name: {
    fontSize: 18,
    fontWeight: "bold"
  },

  classCard: {
    backgroundColor: "white",
    padding: 18,
    borderRadius: 12,
    marginBottom: 20,
  },

  subtitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10
  },

  button: {
    marginTop: 15,
    padding: 12,
    borderRadius: 8,
    alignItems: "center"
  },

  buttonActive: {
    backgroundColor: '#007AFF',
  },

  buttonDisabled: {
    backgroundColor: '#A0C4FF',
  },

  buttonText: {
    color: "white",
    fontWeight: "bold"
  },

  item: {
    flexDirection: "row",
    justifyContent: "space-between",
    backgroundColor: "white",
    padding: 15,
    borderRadius: 10,
    marginBottom: 10,
  },

  statusRow: {
    flexDirection: "row",
    alignItems: "center"
  },

  course: {
    fontSize: 16,
    fontWeight: "bold"
  },

  date: {
    fontSize: 13,
    color: "#777"
  },

  present: {
    color: "#2ecc71",
    marginLeft: 6,
    fontWeight: "bold"
  },

  absent: {
    color: "#e74c3c",
    marginLeft: 6,
    fontWeight: "bold"
  },

  // agar kolom input dan kotak statistiknya terlihat rapi dan selaras dengan desain
inputCatatan: {
  borderWidth: 1,
  borderColor: '#ccc',
  borderRadius: 8,
  padding: 10,
  marginTop: 15,
  backgroundColor: '#fafafa',
},
statsCard: {
  flexDirection: 'row',
  justifyContent: 'space-around',
  backgroundColor: 'white',
  padding: 15,
  borderRadius: 10,
  marginBottom: 20,
},
statBox: {
  alignItems: 'center',
},
statNumber: {
  fontSize: 24,
  fontWeight: 'bold',
  color: 'green',
},
statLabel: {
  fontSize: 14,
  color: 'gray',
},
});

export default Home;