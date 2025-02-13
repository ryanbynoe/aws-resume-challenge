# AWS Cloud Resume Challenge

> *"I could just stop here before Lambda and call it a day..."*  
> *"This would have been much easier if I just granted Admin Access..."*  
> *"Wait... I can import the resources in Terraform!?"*  
> *"If this says InvalidAccessKeyID one more time!"*  
> *"COMPLETEEEEEE! The mods I'll think about it later!"*

I tackled this challenge a few years ago, right before getting my **AWS Solutions Architect - Associate** certification. Back then, I stopped at the Lambda step without finishing. This time around, despite the temptation to stop again, I made a commitment to myself to see it through to the end.

---

## The Resources

Even with my AWS background, I relied on several valuable resources throughout this journey. Here are the key ones that made a difference:

- **Forrest Brazeal's "The Cloud Resume Challenge Guidebook"** - This is where it all started. The book breaks down the challenge into digestible pieces and offers insights on succeeding in the cloud space. It's packed with practical resources worth exploring.

- **["Develop and Deploy AWS Lambda Functions with Serverless"](https://www.udemy.com) on Udemy by Paulo Dichone** - This course helped refresh my Lambda knowledge and introduced me to the Serverless framework. While I primarily used it for Lambda, it also covers **SAM** for infrastructure as code.

---

## AWS Environment Setup (Pro Route)

Following Forrest Brazeal's professional recommendation for AWS environment setup, I chose the expert path - though I had no idea it would be the most challenging route. But hey, if you want to be a pro, you've got to think like one!

My first step was creating a dedicated **AWS account** for AWS Organizations and SSO. For anyone interested in following along, you can find the account creation guide in AWS's knowledge center:  
🔗 [Create and Activate AWS Account](https://repost.aws/knowledge-center/create-and-activate-aws-account)  

Feels good to have a fresh and clean dashboard to work in! 🤘
![image](https://github.com/user-attachments/assets/091868ce-2689-4dff-bca8-06755d20bf6f)


---

## CloudWatch Alarm Setup

As a precautionary measure, I set up **billing alarms** through CloudWatch to keep tabs on any charges. My aptly named **"Uh-Oh" alarm** sends me an email notification whenever charges exceed $20. AWS's CloudWatch documentation provides a detailed guide on monitoring estimated charges:  

🔗 [Monitor Estimated Charges with CloudWatch](https://docs.aws.amazon.com/AmazonCloudWatch/latest/monitoring/monitor_estimated_charges_with_cloudwatch.html)
![image](https://github.com/user-attachments/assets/99df8ca5-11d6-423b-8f5d-5383c7d5b178)


---

## The Front End

My pride wanted to build the website from scratch, but let's be real - my front-end development skills were deep in hibernation! So I went with the next best option: **AI!** Specifically, **ChatGPT and Claude**. AI is here to stay, so why not leverage it?

Starting with ChatGPT, I kept it simple with the prompt:  

> *"Build an HTML/CSS website based on this information. Use my resume as a reference:"*

This kicked off what became a love/hate collaboration - because let's face it, AI isn't perfect. Between the frustrating **chat timeouts**, moments when AI confidently **misunderstands your prompt**, and various other quirks, it was quite the journey. After several days of **tweaking and fine-tuning**, I was finally ready to dive into the **Cloud portion** of the challenge.

![image](https://github.com/user-attachments/assets/0304bf6f-a0c2-4fb5-b77d-780e7afba968)


---

### Hosting Static Website on S3

The website hosting part was a breeze. AWS's documentation provides a **straightforward guide** for setting up static website hosting on **S3**:  

🔗 [Hosting Static Website on S3](https://docs.aws.amazon.com/AmazonS3/latest/userguide/HostingWebsiteOnS3Setup.html)

Taking advantage of **GoDaddy's Black Friday deal**, I snagged **ryanonacloud.com** for just a **penny in the first year** (~$71 total for three years with security protection). This domain later connected to my **CloudFront** distribution.  

A good walkthrough on attaching the domain to CloudFront:  
🔗 [YouTube Guide](https://www.youtube.com/watch?v=99H96S-Neq0)

![image](https://github.com/user-attachments/assets/6d823728-bd11-4762-8a11-5701d2385f22)


---

### Frontend Obstacles

The **real challenge** turned out to be the **HTML/CSS setup**. Working with AI to create the site wasn't as smooth as expected - it **demanded patience, research, and a solid grasp of HTML/CSS fundamentals**.

Example: The **mobile version** was a nightmare! The header was hogging about **70% of the screen real estate**, and it took me quite some time to fix it.

---

## The Back End

This was the part of the challenge I dreaded - **Lambda and API Gateway** were pretty intimidating at first. To tackle it:

- I used **Paul Dichone’s Udemy course** to get comfortable with **Lambda** and build the **visitor counter**.
- For **API Gateway**, I dove into **YouTube tutorials**.
- **DynamoDB** was relatively easy, thanks to **Tiny Technical Tutorials**.

### The Real Headache? IAM Permissions

Using **SSO** meant dealing with **permission denied errors** left and right. I had to **pivot from IAM to Identity Center** for creating **permission sets**, which felt like walking in circles in a dense forest. But here's the thing - **keep troubleshooting, and you'll eventually spot that light at the end of the tunnel!** 💡

---

## Infrastructure as Code

I chose **Terraform** for this challenge, leveraging my experience with it - though it still turned out to be quite humbling! After running **`terraform init`** and **`terraform apply`** so many times, they're permanently etched in my brain.  

A crucial realization:  
🚀 *I could import existing resources instead of creating new ones from scratch!* 🤦🏾  

Using **AWS SSO**? Stick to `aws configure sso` instead of `aws configure` - trust me, it'll save you **some headaches**.

---

## CI/CD with GitHub Actions

Despite previous **GitHub Actions** experience, authentication issues haunted me. **After 25 workflow tests (!), I finally cracked the code.** 🔓  

![image](https://github.com/user-attachments/assets/1abc58dc-5d52-42da-9288-65eceb773c13)


🚨 The **InvalidAccessKeyId** error will probably haunt me in my nightmares.  
After exhaustive **Google searches & Stack Overflow deep dives**, the solution was **creating an OIDC provider and a new role**, allowing proper authentication between GitHub and AWS.

---

## Results & Closing Statements  

Let me be clear - this project isn't for the faint of heart. If you're taking on this challenge, I encourage you to **push through the Lambda and DynamoDB steps**. My journey spanned **three weeks** of intense troubleshooting and research. While my AWS background helped with **CloudFront and S3**, services like **Lambda and DynamoDB** required serious study time.  

Now that it's done, I finally understand how **Thanos felt at the end of the Avengers!** 😆

### Lessons Learned:

- **The harder path is often the best one.** I could have used my **playground AWS account with admin access**, but by starting fresh (**AWS Organizations, IAM Identity Center**), I **gained valuable security & account management insights**.
- **The Docs are your best friend.** We live in an era of **instant gratification**, but **AWS/Terraform documentation** was the ultimate **lifesaver**.

---

## Next Steps

I've got my sights set on tackling some **mods** from the AWS Cloud Resume Challenge book:

- **Security Mod** with the Spoof Troop to fortify my **DNS setup**.
- **"All The World's Stage" DevOps Mod** - transforming **CI/CD into a multi-stage workflow**.

Beyond that, I'm planning to **deploy my website on an EC2 instance** and **switch to Jenkins** for my CI/CD pipeline.

---

### Special Thanks  
🙏 **Shoutout to Forrest Brazeal** for creating this incredible challenge - it's been quite the journey!  

🔗 **View the website and resume here:** [ryanonacloud.com](https://ryanonacloud.com)
