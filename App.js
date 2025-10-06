import React, { useState } from 'react';
import {
  StyleSheet,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Alert,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator
} from 'react-native';

const API_URL = 'https://flask-sam.onrender.com/api/solve'; // استبدل بـ IP جهازك

export default function App() {
  const [a, setA] = useState('');
  const [b, setB] = useState('');
  const [c, setC] = useState('');
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [history, setHistory] = useState([]);

  const solveEquation = async () => {
    if (!a || !b || !c) {
      Alert.alert('خطأ', 'يرجى إدخال جميع المعاملات');
      return;
    }

    if (parseFloat(a) === 0) {
      Alert.alert('خطأ', 'المعامل a لا يمكن أن يكون صفرًا');
      return;
    }

    setLoading(true);
    try {
      const response = await fetch(API_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          a: parseFloat(a),
          b: parseFloat(b),
          c: parseFloat(c),
        }),
      });

      const data = await response.json();

      if (data.status === 'success') {
        setResult(data);
        // إضافة إلى السجل
        setHistory(prev => [data, ...prev.slice(0, 4)]);
      } else {
        Alert.alert('خطأ في الحساب', data.message);
      }
    } catch (error) {
      Alert.alert('خطأ في الاتصال', 'تعذر الاتصال بالخادم. تأكد من تشغيل الخادم وأن الـ IP صحيح.');
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setA('');
    setB('');
    setC('');
    setResult(null);
  };

  const formatSolution = (solution, index) => {
    return (
      <Text key={index} style={styles.solutionText}>
        x{index + 1} = {solution}
      </Text>
    );
  };

  return (
    <KeyboardAvoidingView 
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <Text style={styles.title}>حل المعادلات التربيعية</Text>
        <Text style={styles.subtitle}>ax² + bx + c = 0</Text>

        <View style={styles.inputContainer}>
          <TextInput
            style={styles.input}
            placeholder="أدخل قيمة a"
            value={a}
            onChangeText={setA}
            keyboardType="numeric"
            placeholderTextColor="#999"
          />
          <TextInput
            style={styles.input}
            placeholder="أدخل قيمة b"
            value={b}
            onChangeText={setB}
            keyboardType="numeric"
            placeholderTextColor="#999"
          />
          <TextInput
            style={styles.input}
            placeholder="أدخل قيمة c"
            value={c}
            onChangeText={setC}
            keyboardType="numeric"
            placeholderTextColor="#999"
          />
        </View>

        <View style={styles.buttonContainer}>
          <TouchableOpacity
            style={[styles.button, styles.solveButton]}
            onPress={solveEquation}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text style={styles.buttonText}>حل المعادلة</Text>
            )}
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.button, styles.resetButton]}
            onPress={resetForm}
          >
            <Text style={styles.buttonText}>إعادة تعيين</Text>
          </TouchableOpacity>
        </View>

        {result && (
          <View style={styles.resultContainer}>
            <Text style={styles.resultTitle}>النتيجة</Text>
            <Text style={styles.equationText}>{result.equation}</Text>
            <Text style={styles.typeText}>نوع الحل: {result.type}</Text>
            <Text style={styles.discriminantText}>
              قيمة المميز: {result.discriminant}
            </Text>
            <View style={styles.solutionsContainer}>
              <Text style={styles.solutionsTitle}>الحلول:</Text>
              {result.solutions.map((solution, index) =>
                formatSolution(solution, index)
              )}
            </View>
          </View>
        )}

        {history.length > 0 && (
          <View style={styles.historyContainer}>
            <Text style={styles.historyTitle}>السجل</Text>
            {history.map((item, index) => (
              <View key={index} style={styles.historyItem}>
                <Text style={styles.historyEquation}>{item.equation}</Text>
                <Text style={styles.historySolution}>
                  {item.solutions.join(' , ')}
                </Text>
              </View>
            ))}
          </View>
        )}
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  scrollContainer: {
    flexGrow: 1,
    padding: 20,
    paddingTop: 50,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    textAlign: 'center',
    color: '#2c3e50',
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 18,
    textAlign: 'center',
    color: '#7f8c8d',
    marginBottom: 30,
  },
  inputContainer: {
    marginBottom: 30,
  },
  input: {
    backgroundColor: '#fff',
    padding: 15,
    borderRadius: 10,
    marginBottom: 15,
    fontSize: 16,
    borderWidth: 1,
    borderColor: '#ddd',
    textAlign: 'right',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 30,
  },
  button: {
    flex: 1,
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    marginHorizontal: 5,
  },
  solveButton: {
    backgroundColor: '#3498db',
  },
  resetButton: {
    backgroundColor: '#e74c3c',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  resultContainer: {
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 15,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 5,
  },
  resultTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#2c3e50',
    marginBottom: 15,
    textAlign: 'center',
  },
  equationText: {
    fontSize: 18,
    color: '#34495e',
    textAlign: 'center',
    marginBottom: 10,
    fontFamily: Platform.OS === 'ios' ? 'Courier New' : 'monospace',
  },
  typeText: {
    fontSize: 16,
    color: '#27ae60',
    textAlign: 'center',
    marginBottom: 10,
    fontWeight: 'bold',
  },
  discriminantText: {
    fontSize: 16,
    color: '#8e44ad',
    textAlign: 'center',
    marginBottom: 15,
    fontFamily: Platform.OS === 'ios' ? 'Courier New' : 'monospace',
  },
  solutionsContainer: {
    marginTop: 10,
  },
  solutionsTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#2c3e50',
    marginBottom: 10,
    textAlign: 'center',
  },
  solutionText: {
    fontSize: 16,
    color: '#2980b9',
    textAlign: 'center',
    marginBottom: 5,
    fontFamily: Platform.OS === 'ios' ? 'Courier New' : 'monospace',
    fontWeight: 'bold',
  },
  historyContainer: {
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 5,
  },
  historyTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#2c3e50',
    marginBottom: 15,
    textAlign: 'center',
  },
  historyItem: {
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ecf0f1',
  },
  historyEquation: {
    fontSize: 14,
    color: '#34495e',
    textAlign: 'right',
    marginBottom: 5,
  },
  historySolution: {
    fontSize: 12,
    color: '#7f8c8d',
    textAlign: 'right',
  },
});