import EncryptedStorage from "react-native-encrypted-storage";

class SecureStore {

    async getItemAsync(_key) {
        try {
          const dataGot = await EncryptedStorage.getItem(_key);
          if(dataGot!==undefined){
            return dataGot;
          }
        } catch {
          return null;
        }
    }

    async setItemAsync(_key,_data){
        try {
          await EncryptedStorage.setItem(_key,_data);
        } catch {
          return null;
        }
    }

    async removeItemAsync(_key){
      try {
        await EncryptedStorage.removeItem(_key);
      } catch {
        return null;
      }
  }

}
export default new SecureStore();