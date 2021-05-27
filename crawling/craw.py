from selenium import webdriver as wd
from bs4 import BeautifulSoup
import time
import pandas as pd
import requests
import re

def get_urls_from_youtube_with_keyword(keyword):
    titles = []
    urls = []

    search_keyword_encode = requests.utils.quote(keyword)
    url = "https://www.youtube.com/results?search_query=" + search_keyword_encode
    driver = wd.Chrome(executable_path="D:/JNUCST/api/chromedriver.exe")
    driver.get(url)

    last_page_height = driver.execute_script(
        "return document.documentElement.scrollHeight")

    while True:
        driver.execute_script(
            "window.scrollTo(0, document.documentElement.scrollHeight);")

        time.sleep(3.0)

        new_page_height = driver.execute_script(
            "return document.documentElement.scrollHeight")

        if new_page_height == last_page_height:
            break
        last_page_height = new_page_height

    html_source = driver.page_source
    driver.quit()

    soup = BeautifulSoup(html_source, 'lxml')
    datas = soup.select("a#video-title")

    for data in datas:
        title = data.text.replace('\n', '')
        url = "https://www.youtube.com/" + data.get('href')

        titles.append(title)
        urls.append(url)

    return titles, urls

def crawl_youtube_page_html_sources(urls):
    html_sources = []

    for i in range(len(urls)):
        driver = wd.Chrome(executable_path="D:/JNUCST/api/chromedriver.exe")
        driver.get(urls[i])
        driver.set_window_size(500, 3000)

        last_page_height = driver.execute_script(
            "return document.documentElement.scrollHeight")
        while True:
            driver.execute_script(
                "window.scrollBy(0, document.documentElement.scrollHeight);")
            time.sleep(3.0)
            new_page_height = driver.execute_script(
                "return document.documentElement.scrollHeight")

            if new_page_height == last_page_height:
                break
            last_page_height = new_page_height

        html_source = driver.page_source
        html_sources.append(html_source)
        driver.quit()
    return html_sources

def get_user_IDs_and_comments(html_sources):
    my_dataframes = []
    for html in html_sources:
        soup = BeautifulSoup(html, 'lxml')
        youtube_comments = soup.select('yt-formatted-string#content-text')
  
        str_youtube_comments = []

        for i in range(len(youtube_comments)):
            str_tmp = str(youtube_comments[i].text)
            str_tmp = str_tmp.replace('\n', '')
            str_tmp = str_tmp.replace('\t', '')
            str_tmp = str_tmp.replace('               ', '')

            str_youtube_comments.append(str_tmp)

        pd_data = {"Comment": str_youtube_comments}
        youtube_pd = pd.DataFrame(pd_data)
        my_dataframes.append(youtube_pd)

    return my_dataframes


def convert_csv_from_dataframe(titles, my_dataframes):
    for i in range(len(my_dataframes)):
        title = re.sub(
            '[-=+,#/\?:^$.@*\"※~&%ㆍ!』\\‘|\(\)\[\]\<\>`\'…《\》]', '', titles[i])
        my_dataframes[i].to_csv("{}.csv".format(title))

#keywords = ['학교', '학교생활', '일진', '중학생', '고등학생', '중딩', '고딩']

titles, url = get_urls_from_youtube_with_keyword("학교")
#titles = []
#url = []
#titles.append("example");
#url.append("https://www.youtube.com/watch?v=4p2wC_yV6cg")
html_sources = crawl_youtube_page_html_sources(url)
my_dataframes = get_user_IDs_and_comments(html_sources)
convert_csv_from_dataframe(titles, my_dataframes)
