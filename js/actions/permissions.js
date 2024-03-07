import DeviceInfo from "react-native-device-info";
import {PermissionsAndroid, Platform} from "react-native";

export const askLocationPermissions = async () =>
    await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
        {
            title: 'Permisos de ubicación',
            message: '¿Deseas dar le a CASCO tu ubicación?',
            buttonNegative: 'cancelar',
            buttonPositive: 'ok'
        }
    );

export async function askCameraPermissions() {
    try { // Ask for camera permissions
        const versionOS = DeviceInfo.getSystemVersion().charAt(0);

        if (Platform.OS === 'ios') { return true; } // if platform is IOS
        if (parseInt(versionOS, 10) < 6) { return true; } // if old android version

        // if platform is Android
        const granted = await PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.CAMERA);
        if (granted === PermissionsAndroid.RESULTS.GRANTED) { // if permissions granted
            return true;
        }  // if permissions denied
        return false;
    } catch (err) {
        console.warn(err);
    }
}

export async function askStoragePermissions() {
    try { // Ask for camera permissions
        const versionOS = DeviceInfo.getSystemVersion().charAt(0);

        if (Platform.OS === 'ios') { return true; } // if platform is IOS
        if (parseInt(versionOS, 10) < 6) { return true; } // if old android version

        // if platform is Android
        const granted = await PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE);
        if (granted === PermissionsAndroid.RESULTS.GRANTED) { // if permissions granted
            return true;
        }  // if permissions denied
        return false;
    } catch (err) {
        console.warn(err);
    }
}