import { FirebaseFirestoreTypes } from '@react-native-firebase/firestore';
import dayjs from 'dayjs';

export function dateFormat(timestamp: FirebaseFirestoreTypes.Timestamp) {
    if(timestamp){
        const date = new Date(timestamp.toDate());

        const parseDate = dayjs(date).startOf('day')

        const parsedDate = parseDate.toISOString()

        return parsedDate
    }
}
