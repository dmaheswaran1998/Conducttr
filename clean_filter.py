#importing the relevant modules
def get_following(consumer_key,partition_id):
    url = data_config.get_following+partition_id
    headers = {"Authorization":"Bearer "+consumer_key}
    response = requests.get(url, headers=headers)
    data = json.loads(response.content)
    
    return data["response"]


def get_permissions(consumer_key,partition_id):
    url = data_config.get_permssions+partition_id
    headers = {"Authorization":"Bearer "+consumer_key}
    response = requests.get(url, headers=headers)
    #print(response)
    data = json.loads(response.content)
    data = data["response"]["permissions"]
    return data

def get_message_data(consumer_key,partition_id):
    url = data_config.get_activity+partition_id
    headers = {"Authorization":"Bearer "+consumer_key}
    response = requests.get(url, headers=headers)
    data = json.loads(response.content)
    #st.write(data)
    timeline = data["detailed_log"]
    summary = data["summary"]
    return timeline, summary

def get_cloud_personas(consumer_key,partition_id):
    url = data_config.get_personas+partition_id
    headers = {"Authorization":"Bearer "+consumer_key}
    response = requests.get(url, headers=headers)
    data = json.loads(response.content)
    return data["response"]["personas"]

def remove_duplicates(list, unique_list):
    for item in list:
        if item not in unique_list:
            unique_list.append(item)
    return unique_list   

def remove_bracket(list):
    list1=[]
    for item in list:
        item2 = item[1:]
        list1.append(item2)
    return list1 

def chainer(s):
    return list(chain.from_iterable(s.str.split(',')))


import csv, json, requests
import streamlit as st
import pandas as pd
import seaborn as sns
import data_config
import re
import numpy as np
from itertools import chain
from collections import defaultdict


def filter_page():
    consumer_key = data_config.consumer_key
    partition_id = data_config.partition_id

    #defining the API functions


    data=get_message_data(consumer_key,partition_id)

    data1=list(data)
    keys=data[0].keys()

    #appending all the dates 
    dates=[]
    for i in keys:
        dates.append(i)

    #appending all the persona
    persona_id=[]
    for i in range(0, len(dates)):
        id=dates[i][-5:]
        persona_id.append(id)  


    values1=[]
    values=data[0].values()
    for i in values:
        values1.append(i)      

    channel=[] #stores what medium was being used 
    interaction=[] 
    RFI=[]
    text=[]
    id1=[] #storing who sent an interaction
    id2=[] #storing who received an interaction 

    for i in range(0, len(values1)):
        x = values1[i].split("]")
        channel.append(x[0])
        interaction.append(x[1])
        RFI.append(x[2])
        text.append(x[3])
        id1.append(x[4])
        id2.append(x[5])


    #editing each item in the lists (just some data wrangling )

    interaction=remove_bracket(interaction)
    channel=remove_bracket(channel)
    RFI=remove_bracket(RFI)
    text=remove_bracket(text)
    id1=remove_bracket(id1)
    id2=remove_bracket(id2)


    text2=[]
    for item in text:
        edited_text=re.sub("(<br\s*/>)","", item)
        edited_text=re.sub("(<b)","", edited_text)
        edited_text=edited_text.replace("\\","")
        text2.append(edited_text)

    #editing the content of texts so they are more readable

    #Further editing dates (getting rid of miscellaneous characters)

    dates2=[]
    for item in dates:
        item1=item[:-6]
        dates2.append(item1)

    df=pd.DataFrame({"date": dates2, "persona_id":persona_id,"channel": channel, "interaction": interaction, 
                    "Text":text2, "From": id1, "To":id2})


    #This first df above is a bit unreadable as all the interactions are through codes. Thus, the next step is to link the codes in the df above with the personas

    #Using the API
    persona=get_cloud_personas(consumer_key,partition_id)

    unique_persona_id=[]
    for item in persona_id:
        if item not in unique_persona_id:
            unique_persona_id.append(item)

    #getting all the unique persona keys and linking them 
    print(unique_persona_id)

    name=[]


    for item in unique_persona_id:
        name.append(persona[item]["details"]["name"])

    persona_df=pd.DataFrame({"persona_id":unique_persona_id, "name": name})

    print(persona_df)

    #editing the id2 to make it a bti more workable

    nospace_id2=list(filter(None, id2))

    edited_list2 = [y for x in nospace_id2 for y in x.split(',')]


    #all from and to ids and then getting a unique list (id1 and the edited id2)
    all_ids=id1+edited_list2
    unique_ids=[]
    remove_duplicates(all_ids, unique_ids)


    names_list=[]





    #getting twitter ids and email ids 


    for item in unique_ids:
        #twitter data
        names_list.append(persona[item]["microblog"]["displayName"])
        #email



    channel_df=pd.DataFrame({"From":unique_ids, "twitter name":names_list
        
    })

    #linking unique ids with names on different channels

    channel2_df=pd.DataFrame({"To":unique_ids, "From":unique_ids, "twitter name":names_list,
        
    })

    #editing channe

    channel2_df['twitter name'] = channel2_df['twitter name'].str.replace('[^\w\s#@/:%.,_-]', '', flags=re.UNICODE)

    #figuring out channels

    from_merged=channel2_df[["From", "twitter name"]]


    to_merged=channel2_df[["To", "twitter name"]]
    All=["All"]
    All=pd.DataFrame({"To":All, "twitter name":All})
    to_merged=to_merged.append(All)


  
    # calculate lengths of splits
    lens = df['To'].str.split(',').map(len)

    # create new dataframe, repeating or chaining as appropriate
    df2 = pd.DataFrame({'date': np.repeat(df['date'], lens),
                        'persona_id': np.repeat(df['persona_id'], lens),
                        'channel': np.repeat(df['channel'], lens),
                        'interaction': np.repeat(df['interaction'], lens),
                        'Text': np.repeat(df['Text'], lens),
                        'From': np.repeat(df['From'], lens),
                        'To': chainer(df['To'])})

    #editing the dataframe so that it can 'explode'
    df2["Frequency"]=1
    #linking names with the from
    merged=pd.merge(df2, from_merged, on='From')

    #renaming columns

    merged=merged.rename(columns={"twitter name":"from"})
    merged=merged.drop(columns={"From"})

    #When To is Blank assuming that communications sent to everyone
    merged['To'].replace('','Everyone', inplace=True)

    #linking the people who sent messages "To"
    merged_2=pd.merge(merged,to_merged, on='To')

    merged_2=merged_2.rename(columns={"twitter name":"to"})

    #merging the dataframes
    merged_final=pd.merge(merged_2,persona_df, on='persona_id')

    #getting rid of irrelevant columns
    merged_final=merged_final[["date","name","channel", "interaction", "Text", "from", "to","Frequency"]]

    merged_final2=merged_final[["date", "name", "channel", "interaction", "Text", "from", "to"]]

    merged_final2["Text"]=merged_final2["Text"].replace("", "No Text")

    data_list=[]

    date=merged_final2['date'].to_list()
    name=merged_final2["name"].to_list()
    channel=merged_final2["channel"].to_list()
    interaction=merged_final2["interaction"].to_list()
    text=merged_final2["Text"].to_list()
    from_list=merged_final2["from"].to_list()
    to_list=merged_final2["to"].to_list()


    for i in range(0, len(date)):
        dict2={"Date":date[i], "Name":name[i],  "Channel":channel[i], "Interaction":interaction[i], 
            "Text":text[i], "From":from_list[i], "To":to_list[i]}
        data_list.append(dict2)


    return (data_list)



