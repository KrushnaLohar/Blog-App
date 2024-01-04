import conf from "../conf/conf";
import { Client, Account, ID } from "appwrite";

export class AuthService {
    // first client will be made 
    client = new Client();
    account;

    constructor() {
        this.client
            .setEndpoint(conf.appwriteUrl)
            .setProject(conf.appwriteProjectId);
        this.account = new Account(this.client);
    }

    async createAccount ({email, password, name}) {
        try {
            // userAccount contain info of created acc
            const userAccount = await this.account.create(ID.unique(), email, password, name)
            if(userAccount) {
                // call another mthd after create acc you will redirected to the login page
                return this.login({email, password});
            } else {
                return userAccount;
            }
        } catch (error) {
            throw error
        }
    }

    async login ({email, password}) {
        try {
            return await this.account.createEmailSession(email, password)
        } catch (error) {
            throw error
        }
    }

    async getCurrentUser() {
        try {
            return await this.account.get();
        } catch (error) {
            console.log("Appwrite service :: getCurrentUser :: error", error);
        }
    
        return null;
    }
    

    async logOut() {
        try {
            await this.account.deleteSessions('current');
        } catch (error) {
            console.log("Appwrite Serivce :: logOut :: error", error);
        }
    }

}

const authService = new AuthService();

export default authService;