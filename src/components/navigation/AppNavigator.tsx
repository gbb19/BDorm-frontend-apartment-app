import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { ActivityIndicator, View, StyleSheet } from 'react-native';
import { useAuth } from '../../context/AuthContext';
import { TabNavigator } from './TabNavigator';
import { AuthNavigator } from './AuthNavigator';

export function AppNavigator() {
  const { isLoggedIn, isLoading } = useAuth();

  if (isLoading) {
    // แสดงหน้าจอโหลดระหว่างที่กำลังตรวจสอบสถานะการเข้าสู่ระบบ
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }

  return (
    <NavigationContainer>
      {isLoggedIn ? <TabNavigator /> : <AuthNavigator />}
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
