import urllib
from urllib.parse import urlparse
import urllib.robotparser as urobot
from bs4 import BeautifulSoup
import execjs
import pandas as pd
import string
from selenium import webdriver
import re

def website_content_parser(url_in_question):
    
    domain = urlparse(url_in_question).netloc
    robots_checker = urobot.RobotFileParser()
    try:
        robots_checker.set_url(domain + "/robots.txt")
        robots_checker.read()

        if(robots_checker.can_fetch("*", url_in_question) == False):
            return "Error", 403
    except:
        pass

    with urllib.request.urlopen(url_in_question) as url:
        soup = BeautifulSoup(url,"lxml")
        possible_headlines = [soup_h1.text for soup_h1 in soup.find_all('h1')]
    
    #Calling cleaner_plugin: You need to change the path to fit the relative location from where you are calling this python script!
    
    ctx = execjs.compile("""
     function call(filetoopen){
        var reading = require('./News_Reaction_Analysis/News_Article_Scrapper/cleaner_plugin')
        var cleaning = new reading();

        var response = cleaning.read(filetoopen);
        return response;
     }
     """)

    store = ctx.call("call", str(soup.encode('utf8')))

    soup_refined = BeautifulSoup(store,"lxml")
    queue = [([], soup_refined)]  # queue of (path, element) pairs
    i = 0
    dataframe_html = pd.DataFrame(columns=['Path', 'Content','Tag',"Link"])
    while queue: #Iterates breadth and then depth wise.
        path, element = queue.pop(0) #removes the first element of queue, do processing on that element
        if hasattr(element, 'children'):  # check for leaf elements
            for child in element.children: 
                child_id = ""
                try:
                    if(child.has_attr("id")):
                        child_id = child_id +  " ID: " + str(child["id"])
                except:
                    pass
                queue.append((path + [child.name + str(child_id) if child.name is not None else str(type(child)) + str(child_id)], child)) #for further processing

        if(element.string):
            translator = str.maketrans('','', string.punctuation)
            cleaning = element.string.translate(translator).encode('ascii', errors='ignore')
            cleaning = re.sub(r'[0-9]','',cleaning.decode("utf-8"))
            link = ""
            if(element.name == "a"):
                link = element.get('href')
                if(bool(urlparse(link).netloc) ==  False):
                    link = [url_in_question if url_in_question[-1] != "/" else url_in_question[:-1]][0] + [link if link[0] == "/" else "/"+link][0]
            if (cleaning.replace(" ","") != ""):
                df_store = pd.DataFrame([[path,element.string.encode('ascii', errors='ignore').decode("utf-8").replace("-"," "),element.name,link]], columns=["Path","Content","Tag","Link"])
                dataframe_html = dataframe_html.append(df_store)
        elif(element.name == "img"):
            df_store = pd.DataFrame([[path,element.get('src'),element.name,""]], columns=["Path","Content","Tag","Link"])
            dataframe_html = dataframe_html.append(df_store)

    dataframe_html = dataframe_html.reset_index(drop=True)
    information = pd.DataFrame(columns=['stub', 'indices', 'content'])
    stub = "<Stub Placeholder>"
    index_persistent = [0,0]
    info_store = None
    ready_to_add = False
    for index, row in dataframe_html.iterrows():

        if("ID:" in row['Path'][-1]):
            row_remb = re.findall("^(.*?)\sID\:", row['Path'][-1])[0]
        else:
            row_remb = row['Path'][-1]

        if(row_remb in ["<class 'bs4.element.NavigableString'>","b","strong","a","i","em","span","abbr"] and re.sub(r'\\[a-zA-Z0-9]', '', row['Content']).replace(" ","") != ""):
            if(row['Path'][:-2] == stub):
                info_store = str(info_store) + " " + str(row['Content'])
                index_persistent[1] = index
            else:
                if(info_store != None):
                    addition = pd.DataFrame([[stub,index_persistent,info_store]], columns=['stub', 'indices', 'content'])
                    information = pd.concat([information, addition], ignore_index = True)
                stub = row['Path'][:-2]
                info_store = row['Content']
                index_persistent = [index, index]
        else:
            if(info_store != None):
                addition = pd.DataFrame([[stub,index_persistent,info_store]], columns=['stub', 'indices', 'content'])
                information = pd.concat([information, addition], ignore_index = True)
            info_store = None
            stub = "<Stub Placeholder>"

    if(info_store != None):
        addition = pd.DataFrame([[stub,index_persistent, info_store]], columns=['stub', 'indices', 'content'])
        information = pd.concat([information, addition], ignore_index = True)

    information = information[information.apply(lambda x : len(' '.join(list(filter(lambda y : len(y) > 1, re.sub(r'[^a-zA-Z ]+', '', re.sub(r'\\[a-zA-Z0-9]', '', x['content'])).split()))).split(" ")) > 15, axis=1)]
    information = information.reset_index(drop=True)

    #dataframe_html contains raw uncombined content (along with tags), information contains combined text, possible_headlines contains the possible headlines in the website
    
    return information["content"].to_list(), possible_headlines