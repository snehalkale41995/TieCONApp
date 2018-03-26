import firebase, {firestoreDB} from '../config/firebase';

export class Service {
    static getDocRef(docName) {
        return firestoreDB.collection(docName);
    }

    static addSnapshotListener(docName, successFn, errorFn) {
        Service.getDocRef(docName).onSnapshot((snapshot) => {
            //Audit Statements
            successFn(snapshot);
        });
    }
}