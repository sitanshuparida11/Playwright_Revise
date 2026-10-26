//Locaters and methods for the login page
import { Page, Locator } from "@playwright/test";

export class LoginPage{
    //Properties -Locaters of Login Page
    page: Page
    username: Locator
    password: Locator
    loginButton: Locator
    homePageHeader: Locator
    errMsg: Locator

//Initialised the locators in the constructor
    constructor (page: Page){
        this.page = page
        this.username = page.getByPlaceholder('Username')  //this is a keyword that refers to correct class object.
        this.password = page.getByPlaceholder('Password')
        this.loginButton = page.getByRole('button', { name: 'Login' })
        this.homePageHeader = page.getByText('Products', { exact: true })
        this.errMsg = page.locator('[data-test="error"]')
        
    }

    //methods

    //launch the url
    async launchUrl(url: string): Promise<void>{
        await this.page.goto(url)
    }

    //loginIntoApplication()
    async loginIntoApplication(username: string, password: string): Promise<void>{
        await this.username.fill(username)
        await this.password.fill(password)
        await this.loginButton.click()
    }

    //invalid loginIntoApplication()
    async invalidLoginIntoApplication(username: string, password: string): Promise<void>{
        await this.username.fill(username)
        await this.password.fill(password)
        await this.loginButton.click()
    }


    // const loginPage = new LoginPage()  //creating an object of the class it will refer to the constructor and will initialize the locators.
}

   
