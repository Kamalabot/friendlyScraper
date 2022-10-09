# Friendly Scraper

**Friendly Scraper** is a tool that I want for the market research part of my job. Scraping websites can be fun and interesting when the details about the target webpage can be presented in easy to view format. Python, Java, Javascript or whatever the programming language the scraper works, our requirement is to get complete webpage and then decide which parts of the page I want. Some pain points that I faced when scraping the interweb are, 
- How to find which part of the webpage has the information? 
- How to see the pattern if many pages are there?
- What is there are many types of pages 
- If there are dynamic content created by the web server, how to query that?

Friendly scraper tries to answer some of the challenges above by first providing the parts of webpages in categories, which gives you the overview on how to proceed next. And then the fun starts. 

1. Provide the link of the webpage
2. Show the number of Links of Images, Videos and other pages, Lists, Headings, Paragraphs, and Tables in that page are shown.
3. If requested then some number of the above parts of the websites are populated 
4. Classes and Ids used in the tags are shown
5. Option to filter the text data through the tags, classes and Ids are provided. 
6. The cheerio command to scrape using the above selectors are provided.

Here is some live examples
![](businessNews.gif)

Here is another from Ycombinator
![](youCombinator.gif)
Have a great time getting the information from the Interwebs. 