#importing the relevant modules

import csv, json, requests
import pandas as pd
import seaborn as sns
import data_config
import re
import numpy as np
from itertools import chain
from collections import defaultdict



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






def clean_data():

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


    #total_from- grouping messages that each person sent as each impersonation
    total_from = merged_final.groupby(['name','from'])
    total_from=pd.DataFrame(total_from["Frequency"].count())

    #total to grouping for the json format 
    total_to = merged_final.groupby(['name','to'])
    total_to=pd.DataFrame(total_to["Frequency"].count())

    #breakdown of player impersonation and channel
    total_from_channel= merged_final.groupby(['name','from','channel'])
    total_from_channel=pd.DataFrame(total_from_channel["Frequency"].count())


    #grouping by player message sent to and channel 
    total_group = merged_final.groupby(['name','to', "channel"])
    total_to=pd.DataFrame(total_group["Frequency"].count())

    #converting the total_frpm dataset to json format
    results = defaultdict(lambda: defaultdict(dict))

    #jsonifying groupby dataframe
    for index, value in total_from.itertuples():
        for i, key in enumerate(index):
            if i == 0:
                nested = results[key]
            elif i == len(index) - 1:
                nested[key] = value
            else:
                nested = nested[key] 

    #starting to put it into a json_lis
    json_list=[]
    newlist = list()
    for i in results.keys():
        newlist.append(i)

    impersonations2={}
    for item in newlist:
            impersonations=results[item].keys()
            values=[]
            for i in impersonations:    
                values.append(i)
                impersonations2.update({f'{item}':values})

    impersonations3={"impersonations": impersonations2}

    json_list.append(impersonations3)

    merged_final2=merged_final.copy()

    #making sure all channel interactions can be observed by all
    merged_final2["channel"]="All"

    frames=(merged_final, merged_final2)
    merged3=pd.concat(frames)

    merged3['date'] = pd.to_datetime(merged3['date'], infer_datetime_format=True)

    person_list=merged3['name'].to_list()

    person_list_unique=[]

    for item in person_list:
        if item not in person_list_unique:
            person_list_unique.append(item)
            


    total_from_channel= merged_final.groupby(['name','from','channel'])
    total_from_channel=pd.DataFrame(total_from_channel["Frequency"].count())

    #jsonifying second groupby
    results3 = defaultdict(lambda: defaultdict(dict))

    for index, value in total_from_channel.itertuples():
        for i, key in enumerate(index):
            if i == 0:
                nested = results3[key]
            elif i == len(index) - 1:
                nested[key] = value
            else:
                nested = nested[key] 


    results4={"from":results3}
    json_list.append(results4)

    person_list=merged3['name'].to_list()

    #getting list of unique personas (to and from)
    person_list_unique=[]

    for item in person_list:
        if item not in person_list_unique:
            person_list_unique.append(item)


    from_list=merged3["from"].to_list()
    from_list_unique=[]
    for item in from_list:
        if item not in from_list_unique:
            from_list_unique.append(item)


    #getting list of unique channels  
    channel_list=merged3["channel"].to_list()
    channel_list_unique=[]
    for item in channel_list:
        if item not in channel_list_unique:
            channel_list_unique.append(item)

    #creating an empty dictionary 
    dict2={}

    #looking at all the unique persons 
    for person in person_list_unique:
        frames=[]
        for channel in channel_list_unique:
            try:
                channel_1=merged3.loc[(merged3["name"]==f"{person}") &(merged3["channel"]==f'{channel}'), :]
                merged_time_all=channel_1.resample('0.3H', on='date').sum()
                merged_time_all["channel"]=f"{channel}"
                frames.append(merged_time_all)
            except:
                continue
    
        merged=pd.concat(frames)
        merged=merged.reset_index()
        merged['date']=merged['date'].astype(str)
        merged = merged.groupby(['channel', "date"])
        merged1=pd.DataFrame(merged["Frequency"].sum())
        
        results1 = defaultdict(lambda: defaultdict(dict))
        for index, value in merged1.itertuples():
            for i, key in enumerate(index):
                if i == 0:
                    nested = results1[key]
                elif i == len(index) - 1:
                    nested[key] = value
            else:
                nested = nested[key]
        
        
        dict2.update({f'{person}':results1})


    #grouping time intercals in 15 minutes 
    time=merged3.resample('0.3H', on='date').sum()
    time=time.reset_index()
    time['date']=time['date'].astype(str)
    time_list=time["date"].to_list()

    merged_final2['date'] = pd.to_datetime(merged_final2['date'], infer_datetime_format=True)


    dict4={}
    for person in person_list_unique:
        frames=[]
        for from_p in from_list_unique:
            try:
                channel_1=merged_final2.loc[(merged_final2["name"]==f"{person}") &(merged_final2["from"]==f'{from_p}'), :]
                merged_time_all=channel_1.resample('0.3H', on='date').sum()
                merged_time_all["from"]=f"{from_p}"
                frames.append(merged_time_all)
            except:
                continue
    
        merged=pd.concat(frames)
        merged=merged.reset_index()
        merged['date']=merged['date'].astype(str)
        merged = merged.groupby(['from', "date"])
        merged1=pd.DataFrame(merged["Frequency"].sum())
        
        results1 = defaultdict(lambda: defaultdict(dict))
        for index, value in merged1.itertuples():
            for i, key in enumerate(index):
                if i == 0:
                    nested = results1[key]
                elif i == len(index) - 1:
                    nested[key] = value
            else:
                nested = nested[key]
        
        
        dict4.update({f'{person}':results1})


    to_list=merged3["to"].to_list()
    to_list_unique=[]
    for item in to_list:
        if item not in to_list_unique:
            to_list_unique.append(item)



    dict7={}
    for person in person_list_unique:
        frames=[]
        for to_p in to_list_unique:
            try:
                channel_1=merged_final2.loc[(merged_final2["name"]==f"{person}") &(merged_final2["to"]==f'{to_p}'), :]
                merged_time_all=channel_1.resample('0.3H', on='date').sum()
                merged_time_all["to"]=f"{to_p}"
                frames.append(merged_time_all)
            except:
                continue
    
        merged=pd.concat(frames)
        merged=merged.reset_index()
        merged['date']=merged['date'].astype(str)
        merged = merged.groupby(['to', "date"])
        merged1=pd.DataFrame(merged["Frequency"].sum())
        
        results4 = defaultdict(lambda: defaultdict(dict))
        for index, value in merged1.itertuples():
            for i, key in enumerate(index):
                if i == 0:
                    nested = results4[key]
                elif i == len(index) - 1:
                    nested[key] = value
            else:
                nested = nested[key]
        
        
        dict7.update({f'{person}':results4})


    #exact same analysis but for to rather than from
    total_to_channel= merged_final.groupby(['name','to','channel'])
    total_to_channel=pd.DataFrame(total_to_channel["Frequency"].count())


    #jsonifying the groupby database
    results5 = defaultdict(lambda: defaultdict(dict))

    for index, value in total_to_channel.itertuples():
        for i, key in enumerate(index):
            if i == 0:
                nested = results5[key]
            elif i == len(index) - 1:
                nested[key] = value
            else:
                nested = nested[key] 

    results6={"to":results5}

    json_list.append(results6)

    #appending the various results to final JSON

    dict5={"time_list": time_list}
    json_list.append(dict5)

    json_list.append(dict2)

    json_list.append(dict4)

    json_list.append(dict7)

    return json_list
