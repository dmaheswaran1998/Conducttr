#
#  This program GETs messaging activity from a Conducttr partition
#  and outputs to i2 (CSV) and Kumu (JSON)
#
#  Version 1.0
#
#

import csv, json, requests
import streamlit as st
import pandas as pd
import seaborn as sns
import data_config


filename ="report"
outputfile =filename+".json"
csvfile =filename+"_i2.csv"
csvfile2 =filename+"_network_i2.csv"

consumer_key = data_config.consumer_key
partition_id = data_config.partition_id
#partition_id = st.sidebar.text_input("Enter Space number")

# returns "detailed_log" which is time-stamped and "summary" which is a count of messages

kumu = {
  "elements": [],
  "connections" :[]
}
# use this entities list to make sure we don't add the same entity twice
entities = []
# if we've made connection before, increment the link size
connections = {}
connections[0] ={}


def get_response(consumer_key,partition_id):
    url = data_config.get_following+partition_id
    headers = {"Authorization":"Bearer "+consumer_key}
    response = requests.get(url, headers=headers)
    data = json.loads(response.content)

    return data["response"]["following"]

print("cool")

# def get_permissions(consumer_key,partition_id):
#     url = data_config.get_permssions+partition_id
#     headers = {"Authorization":"Bearer "+consumer_key}
#     response = requests.get(url, headers=headers)
#     #print(response)
#     data = json.loads(response.content)
#     data = data["response"]["permissions"]
#     return data


# def get_message_data(consumer_key,partition_id):
#     url = data_config.get_activity+partition_id
#     headers = {"Authorization":"Bearer "+consumer_key}
#     response = requests.get(url, headers=headers)
#     data = json.loads(response.content)
#     #st.write(data)
#     timeline = data["detailed_log"]
#     summary = data["summary"]
#     return timeline, summary

# def get_cloud_personas(consumer_key,partition_id):
#     url = data_config.get_personas+partition_id
#     headers = {"Authorization":"Bearer "+consumer_key}
#     response = requests.get(url, headers=headers)
#     data = json.loads(response.content)
#     return data["response"]["personas"]

# def create_connection_enhanced(from_this, to_that, with_direction,type,size):
#     connection ={
#         "from" :from_this,
#         "to": to_that,
#         "direction":with_direction,
#         "type": type,
#         "size" :size
#     }
#     return connection

# def create_kumu_element_simple(id, type):
#     label,image = get_person_label_and_image(id)
#     ke= {"_id": id,
#          "label": label,
#          "image":image,
#         "element type": type}
#     return ke

# def get_types(list,pos):
#     activity = list[pos]
#     subtype = "Person"
#     linktype = "Link"
#     if (activity[0:4] == "news") or (activity[0:7] == "article"):
#         obtype = "Organization"
#     else:
#         obtype = "Person"
#     return subtype, obtype, linktype

# def gen_connections(from_this,to_that,activity):
#     link = from_this + to_that + activity
#     try:
#         connections[link]["size"] = connections[link]["size"] + 1
#     except:
#         connections[link] = {"link": [from_this, to_that, activity],
#                              "size": 1}
#     return

# # assumes a list from Conducttr in format ["datetime","sentbyID","sentbyEmail","channel","verb","subject","body","subjectID","objectID",
# #                                           "subjectName","subjectnameinchannel","subjectchannelhandle",
# #                                           "subjectimageURL","objectName","objectnameinchannel","objectchannelhandle","objectimageURL"]]
# def add_to_kumu(list):
#     from_this = list[7]
#     to_that = list[8]
#     activity = list[3]+"_"+list[4]
#     #("list =",list)
#     #print(from_this,to_that,activity)
#     if from_this not in entities:
#         entities.append(from_this)
#         ku = create_kumu_element_simple(from_this, "Persona")
#         kumu["elements"].append(ku)
#     if to_that not in entities:
#         entities.append(to_that)
#         if list[4]=="websites":
#             ku = create_kumu_element_simple(to_that, "Organisation")
#         else:
#             ku = create_kumu_element_simple(to_that, "Persona")
#         kumu["elements"].append(ku)

# #   now count up the links. They'll have to be added to Kumu later
#     link = from_this+to_that+activity
#     try:
#         connections[link]["size"] = connections[link]["size"]+1
#     except:
#         connections[link] = {"link":[from_this, to_that,activity],
#                              "size":1}
#     return

# def finally_add_connections():
#     for link in connections:
#         if link != 0:
#             #print(connections[link]["link"][2])
#             ku = create_connection_enhanced(connections[link]["link"][0], connections[link]["link"][1], "directed", connections[link]["link"][2], connections[link]["size"])
#             kumu["connections"].append(ku)
#     return

# def export_connections_to_i2(cloud_personas):
#     all_connections = []
#     #print(connections)
#     for i, link in enumerate(connections):
#         if link != 0:
#             #print(connections[link]["link"])
#             subtype, obtype, linktype = get_types(connections[link]["link"],2)
#             fromName, fromurl = get_persona_basics(cloud_personas,connections[link]["link"][0])
#             if connections[link]["link"][1] !="":
#                 toName, tourl = get_persona_basics(cloud_personas,connections[link]["link"][1])
#             else:
#                 toName = connections[link]["link"][2][:-4]
#                 connections[link]["link"]=[connections[link]["link"][0],toName,connections[link]["link"][2]]
#                 #print("i link = ",i, connections)
#                 tourl = ""
#             all_connections.append(
#                 [connections[link]["link"][0], connections[link]["link"][1], fromName,fromurl,toName,tourl,connections[link]["link"][2],
#                  connections[link]["size"], subtype, obtype, linktype])

#     with open(csvfile2, "w", encoding='utf-8', newline='') as fp:
#         writer = csv.writer(fp)
#         # write header
#         newline = ["From", "To", "FromName","FromImage","ToName","ToImage","Type","Size"]
#         writer.writerow(newline)
#         for row in all_connections:
#             writer.writerow(row)

#     #print("Exported connections for i2 to ",path+csvfile2)
#     return


# #takes the first data between []. Expects "[" to be at the start
# def get_next_chunk(text):
#     first_brace = text.find("]")
#     chunk = text[1:first_brace]
#     remaining_text = text[first_brace+1:]
#     return chunk, remaining_text

# def breakup(text):
#     first_brace = text.find("]")
#     method = text[1:first_brace]
#     second_brace = text.find("]", first_brace+2)
#     from_this = text[first_brace+2:second_brace]
#     to_that = text[second_brace+2:-1]
#     if to_that =="":
#         to_that ="Unknown"
#     return method,from_this, to_that


# def export_to_kumu():
#     for row in export_list:
#         add_to_kumu(row)
#     #print("adding connections")
#     finally_add_connections()
#     with open(outputfile, 'w') as outfile:
#         json.dump(kumu, outfile)

#     #print("Exported to kumu file ",path+outputfile)
#     return


# def export_to_i2():
#     with open(csvfile, "w", encoding='utf-8', newline='') as fp:
#         writer = csv.writer(fp)
#         # write header
#         newline = ["datetime","sentbyID","sentbyEmail","channel","verb","subject","body","subjectID","objectID","subjectName","subjectnameinchannel","subjectchannelhandle","subjectimageURL","objectName","objectnameinchannel","objectchannelhandle","objectimageURL"]
#         writer.writerow(newline)
#         for row in export_list:
#             writer.writerow(row)
#     return

# def get_person_label_and_image(personaId):
#     if personaId in data_config.channels:
#         label = personaId
#         url = data_config.social_images[personaId]
#     else:
#         #print(cloud_personas[personaId]["details"])
#         label = cloud_personas[personaId]["details"]["displayName"]
#         url = cloud_personas[personaId]["details"]["imageUrl"]
#     return label, url

# def get_persona_details(cloud_personas,personaId, this_channel):
#     #st.write("details= ",cloud_personas[personaId])
#     try:
#         display_name = cloud_personas[personaId]["details"]["displayName"]
#         missing = False
#     except: #persona likely to have been deleted
#         display_name = "Deleted"
#         missing = True

#     if not missing:
#         #print("Working on ", personaId," in channel ",this_channel)
#         try:
#             channel_name = cloud_personas[personaId][this_channel]["displayName"]
#         except:#most likely a key error because channel account is missing
#             channel_name = ""

#         if this_channel == "mail":
#             channel_handle = cloud_personas[personaId][this_channel]["email"]
#         else:
#             try:
#                 #print("I'm here baby")
#                 channel_handle = cloud_personas[personaId][this_channel]["handle"]
#             except: #most likely a key error because channel account is missing
#                 channel_handle = ""
#         imageURL = cloud_personas[personaId]["details"]["imageUrl"]
#     else:
#         display_name = "Missing"
#         channel_name =""
#         channel_handle = ""
#         imageURL = data_config.missing_person_url

#     return display_name, channel_name, channel_handle, imageURL

# def get_persona_basics(cloud_personas,personaId):
#     if personaId == "new" or personaId == "microblog" or personaId == "gosocial" or personaId == "mediablog" or personaId == "websites":
#         display_name = personaId
#         url =""
#     else:
#         #print("details = ",cloud_personas[personaId])
#         display_name = cloud_personas[personaId]["details"]["displayName"]
#         url = cloud_personas[personaId]["details"]["imageUrl"]
#         if url[0]== "/": #assume this is hte default image
#             url = data_config.missing_person_url
#     return display_name, url

# def get_next_CSV(text):
#     comma = text.find(",")
#     if comma >1:
#         var = text[:comma]
#         text = text[comma+1:]
#     else:
#         var = text
#         text = ""
#     return var, text

# def get_export_list(cloud_personas,timeline):
#     export_list = []
#     for index in timeline:
#         datetime = index[0:19]
#         sentbyId = index[20:]
#         try:
#             sentbyEmail = cloud_personas[sentbyId]["mail"]["email"]
#         except:
#             sentbyEmail = ""
#         activity = timeline[index]
#         channel, activity = get_next_chunk(activity)
#         verb, activity = get_next_chunk(activity)
#         subject, activity = get_next_chunk(activity)
#         body, activity = get_next_chunk(activity)
#         subjectId, activity = get_next_chunk(activity)
#         objectId, activity = get_next_chunk(activity)

#         if subjectId != "":  # if there's an error, just skip it for now
#             # print("object",objectId)
#             sub_displayName, sub_channel_name, sub_channel_handle, sub_url = get_persona_details(cloud_personas,subjectId, channel)
#             if objectId != "":
#                 text = objectId  # there might be a csv list of objectid if someone cc's or multiple copies others. create a row for each one
#                 while text != "":
#                     objectId, text = get_next_CSV(text)
#                     ob_displayName, ob_channel_name, ob_channel_handle, ob_url = get_persona_details(cloud_personas,objectId, channel)

#                     subtype = "Person"
#                     if channel == "news":
#                         obtype = "Organisation"
#                     else:
#                         obtype = "Person"
#                     linktype = channel + "_" + verb

#                     nextline = []
#                     nextline.append(datetime)
#                     nextline.append(sentbyId)
#                     nextline.append(sentbyEmail)
#                     nextline.append(channel)
#                     nextline.append(verb)
#                     nextline.append(subject)
#                     nextline.append(body)
#                     nextline.append(subjectId)
#                     nextline.append(objectId)
#                     nextline.append(sub_displayName)
#                     nextline.append(sub_channel_name)
#                     nextline.append(sub_channel_handle)
#                     nextline.append(sub_url)
#                     nextline.append(ob_displayName)
#                     nextline.append(ob_channel_name)
#                     nextline.append(ob_channel_handle)
#                     nextline.append(ob_url)
#                     nextline.append(datetime[0:10])
#                     nextline.append(datetime[11:19])
#                     nextline.append(subtype)
#                     nextline.append(obtype)
#                     nextline.append(linktype)
#                     # write to file list
#                     export_list.append(nextline)
#                     #print(nextline)

#             else:
#                 objectId = channel
#                 subtype = "Person"
#                 obtype = "Channel"
#                 linktype = channel + "_" + verb

#                 nextline = []
#                 nextline.append(datetime)
#                 nextline.append(sentbyId)
#                 nextline.append(sentbyEmail)
#                 nextline.append(channel)
#                 nextline.append(verb)
#                 nextline.append(subject)
#                 nextline.append(body)
#                 nextline.append(subjectId)
#                 nextline.append(objectId)
#                 nextline.append(sub_displayName)
#                 nextline.append(sub_channel_name)
#                 nextline.append(sub_channel_handle)
#                 nextline.append(sub_url)
#                 nextline.append(channel)
#                 nextline.append(channel)
#                 nextline.append(channel)
#                 nextline.append("")
#                 nextline.append(datetime[0:10])
#                 nextline.append(datetime[11:19])
#                 nextline.append(subtype)
#                 nextline.append(obtype)
#                 nextline.append(linktype)
#                 # write to file list
#                 #print(nextline)
#                 export_list.append(nextline)

#         else:
#             x = 1  # do nothing

#     df = pd.DataFrame(export_list)

#     df.columns = (["datetime", "sentbyID", "sentbyEmail", "channel", "verb", "subject", "body", "subjectID", "objectID",
#                    "subjectName", "subjectnameinchannel", "subjectchannelhandle", "subjectimageURL", "objectName",
#                    "objectnameinchannel", "objectchannelhandle", "objectimageURL", "date", "time", "subEntity",
#                    "obEntity", "channel-verb"])

#     return export_list, df

# def show_activity_heatmap(df):
#     activity_frame = df[["channel", "verb"]]
#     activity_frame_groups = activity_frame.groupby(["channel", "verb"]).size().reset_index()
#     activity_frame_groups.columns = (["channel", "verb", "count"])

#     #st.write(activity_frame_groups)
#     sm_pivot = activity_frame_groups.pivot(index="verb", columns="channel")#.fillna("")
#     cm = sns.light_palette("blue", as_cmap=True)

#     st.header("Channel activity heatmap")
#     st.write(sm_pivot.style.background_gradient(cmap=cm, axis=None).highlight_null(null_color='white'))
#     return

# def show_player_activity_heatmap(df):
#     player_summary = df[["sentbyEmail", "channel-verb"]].groupby(["sentbyEmail", "channel-verb"]).size().reset_index()
#     #st.write(player_summary)
#     player_summary.columns = (["email", "activity", "count"])
#     cm = sns.light_palette("blue", as_cmap=True)
#     ps_pivot = player_summary.pivot(index="email", columns="activity").style.background_gradient(cmap=cm,
#                                                                                                  axis=None).highlight_null(
#         null_color='white')
#     # .fillna("")
#     st.subheader("Player activity summary")
#     st.write(ps_pivot)
#     #st.write("done")
#     return

# def get_dataframe_for_subset(number_top_players, df):
#     #get a count of activity by player
#     players = df.groupby(["sentbyEmail"]).size().reset_index()
#     players.columns = (["email", "count"])
#     #st.write(players)
#     #now filter the list by the top
#     topps = players.nlargest(number_top_players, "count")
#     #st.write(topps["email"])
#     #st.write(topps["email"].tolist())
#     topguys = df[df["sentbyEmail"].isin(topps["email"].tolist())]
#     st.write(topguys)
#     return topguys

# def get_dataframe_for_player(player, df):
#     #get a count of activity by player
#     #players = df.groupby(["sentbyEmail"]).size().reset_index()
#     #players.columns = (["email", "count"])
#     #st.write(players)
#     #now filter the list by the top
#     #topps = players.nlargest(number_top_players, "count")
#     #st.write(topps["email"])
#     #st.write(topps["email"].tolist())
#     player_df = df[(df.sentbyEmail == player)]
#     st.header("Showing activity for player "+player)
#     st.write(player_df)
#     show_datetime(player_df)
#     show_activity_heatmap(player_df)
#     return player_df

# def get_impersonations(df):
#     player_summary = df[["sentbyEmail", "channel", "subjectnameinchannel","subjectchannelhandle","subjectimageURL"]]
#     #st.write(player_summary)
#     player_summary.columns = (["email", "channel", "impersonation","handle","url"])
#     player_summary["impersona"] = player_summary["channel"]+" ("+player_summary["impersonation"]+") "+player_summary["handle"]
#     #st.write(player_summary)
#     player_impersonation= player_summary.groupby(["email","impersona"]).size().reset_index()
#     player_impersonation.columns = (["email", "impersonation", "count"])
#     #st.write(player_impersonation)

#     cm = sns.light_palette("blue", as_cmap=True)
#     ps_pivot = player_impersonation.pivot(index="impersonation", columns="email").style.background_gradient(cmap=cm,
#                                                                                                 axis=None).highlight_null(
#         null_color='white')
#     # .fillna("")
#     st.subheader("Impersonation activity summary")
#     st.write(ps_pivot)

#     return

# def show_datetime(df):
#     #convert the datetime string into actual datetime attribute
#     try:
#         df["DateTime"] = pd.to_datetime(df["datetime"], format="%Y-%m-%d  %H:%M:%S")
#         df["Time"] = pd.to_datetime(df["datetime"], format="%Y-%m-%d %H:%M:%S").dt.time
#     except:
#         df["DateTime"] = pd.to_datetime(df["datetime"], format="%Y-%m-%d")
#         df["Time"] = pd.to_datetime(df["datetime"], format="%Y-%m-%d %H:%M:%S").dt.time
#     df = df.set_index("DateTime")
#     #st.write(df)
#     df =df.groupby([df.index.hour,"sentbyEmail"]).size()
#     df = df.reset_index()
#     df.columns = ["hour","email","count"]
#     #st.write(df)

#     cm = sns.light_palette("blue", as_cmap=True)
#     ps_pivot = df.pivot(index="email",columns="hour").style.background_gradient(cmap=cm,
#                                                                                  axis=None).highlight_null(
#         null_color='white')
#     st.header("Activity by time of day")
#     st.write(ps_pivot)
#     return

# def show_handle_activity(handle, df):
#     #get a count of activity by player
#     #players = df.groupby(["sentbyEmail"]).size().reset_index()
#     #players.columns = (["email", "count"])
#     #st.write(players)
#     #now filter the list by the top
#     #topps = players.nlargest(number_top_players, "count")
#     #st.write(topps["email"])
#     #st.write(topps["email"].tolist())
#     st.header("Showing activity for handle '"+handle+"'")
#     st.markdown("Note that this is the activity in a _single channel_")
#     player_df = df[(df.subjectchannelhandle == handle)]
#     try:
#         st.image(player_df.iloc[0].subjectimageURL,width=100)
#     except:
#         st.write("no image")
#     st.write(player_df)
#     show_datetime(player_df)
#     show_activity_heatmap(player_df)
#     return player_df

# ###################################
# #
# #   This is the START
# #
# ##################################

# def main():
#     #Get what Space we're investigating
#     partition_id = str(st.sidebar.number_input(label="Space",value=1234,format="%i"))

#     #get the personas and players
#     cloud_personas = get_cloud_personas(consumer_key,partition_id)
#     #for persona in cloud_personas:
#     #    print(persona, cloud_personas[persona])

#     #get the activity data from Conducttr
#     timeline, summary = get_message_data(consumer_key,partition_id)
#     #st.write(timeline, summary)
#     if timeline != {}:
#         #create a list that we can export and a dataframe we can use here
#         export_list,df = get_export_list(cloud_personas,timeline)
#         #st.write(df)


#         top_num = int(st.sidebar.number_input("Enter number of most active players",min_value=1,value=5,key="top_num"))
#         st.header("Showing activity data for "+str(top_num)+ " most active players")
#         new_df = get_dataframe_for_subset(top_num,df)

#         if st.sidebar.checkbox("Show time of day activity"):
#             show_datetime(new_df)

#         if st.sidebar.checkbox("Show handle activity"):
#             #handle = st.sidebar.text_input("Enter channel handle")
#             h1 = new_df.groupby(["subjectchannelhandle"]).size()
#             h2 = h1.index.tolist()
#             handle = st.sidebar.selectbox('Choose a handle', h2)
#             show_handle_activity(handle, new_df)

#         if st.sidebar.checkbox("Show player details"):
#             #player = st.sidebar.text_input("Enter player email")
#             h1 = new_df.groupby(["sentbyEmail"]).size()
#             h2 = h1.index.tolist()
#             player = st.sidebar.selectbox('Choose a player', h2)
#             get_dataframe_for_player(player,new_df)


#         if st.sidebar.checkbox("Show activity summary"):
#             show_activity_heatmap(new_df)
#         if st.sidebar.checkbox("Show player heatmap"):
#             show_player_activity_heatmap(new_df)
#         if st.sidebar.checkbox("Show impersonations"):
#             get_impersonations(new_df)
#     else:
#         st.sidebar.text("No activity data for this Space")


#     st.sidebar.header("Export")
#     kumu = st.sidebar.checkbox(label="Export to Kumu",value=False)
#     i2 = st.sidebar.checkbox(label="Export to i2",value=False)

#     return
# print("run successful")     

   

# if __name__ == '__main__':
#     main()


#print("EXPORT LIST")
#print(export_list)
#print("=================")
# now let's export to kumu

#export_to_kumu()
#export_to_i2()
#export_connections_to_i2(cloud_personas)


