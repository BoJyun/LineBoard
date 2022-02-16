import socketserver
import socket
import threading
from django.shortcuts import render
from rest_framework import status
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from rest_framework.decorators import api_view, permission_classes, authentication_classes
from rest_framework.permissions import AllowAny
from django.db import connection
# from datetime import datetime
import datetime
from django.http import JsonResponse
from channels.layers import get_channel_layer
from asgiref.sync import async_to_sync

# Create your views here.


@api_view(["POST"])
def add_new_RD(request):
    name = request.data.get("name")
    ID = request.data.get("ID")
    extension_num = request.data.get("extension_num")
    bu_type = request.data.get("bu_type")

    sql = "INSERT INTO EMPLOYER (EM_NAME,ID,EXTENSION_NUM,BU_TYPE) VALUE ('{}','{}','{}','{}');".format(
        name, ID, extension_num, bu_type)

    with connection.cursor() as cursor:
        # cursor.execute(sql)
        # connection.commit()

        # with connection.cursor() as cursor:
        sql = "SELECT * FROM EMPLOYER;"
        cursor.execute(sql)
        list = dictfetchall(cursor)

    return JsonResponse(list, safe=False)


@api_view(["GET"])
def inprocess(request):
    result = {}
    chamber = request.GET["chamber"]

    if chamber == "SG24":
        index = 0
    elif chamber == "SG64":
        index = 1
    elif chamber == "CATR":
        index = 2

    result = {'nowUserNam': User_Type[index].NowUser_name, 'nowUserNum': User_Type[index].NowUser_LineNum,
              'nowUserMode': User_Type[index].NowUser_mode, 'nowUserCirNum': User_Type[index].NowUser_cirNum, "startTime": User_Type[index].StartTime,
              'nextUserNam': User_Type[index].NextUser_name, 'nextUserNum': User_Type[index].NextUser_LineNum, 'nextUserMode': User_Type[index].NextUser_mode,
              'nextUserCirNum': User_Type[index].NextUser_cirNum}
    return Response(result)


@api_view(["GET"])
def whiteboard(request):
    result = {}
    chamber = request.GET["chamber"]
    if chamber == "SG24":
        index = 0
    elif chamber == "SG64":
        index = 1
    elif chamber == "CATR":
        index = 2

    sql1 = "SELECT * FROM {} WHERE (DONE=false) AND (cutline=false) AND DATE(startTime)= CURDATE()".format(chamber)
    sql2 = "SELECT * FROM {} WHERE (DONE=false) AND (cutline=true) AND DATE(startTime)= CURDATE()".format(chamber)
    with connection.cursor() as cursor:
        cursor.execute(sql1)
        list = dictfetchall(cursor)
        cursor.execute(sql2)
        list2 = dictfetchall(cursor)

    # print(list, list2)
    if len(list) == 0:
        User_Type[index].NextUser_name = 'None'
        User_Type[index].NextUser_EmployeeID = 0
        User_Type[index].NextUser_LineNum = 0
        User_Type[index].NextUser_mode = "None"
        User_Type[index].NextUser_cirNum = 0
    else:
        User_Type[index].NextUser_name = list[0]['RD_name']
        User_Type[index].NextUser_EmployeeID = list[0]['RD']
        User_Type[index].NextUser_LineNum = list[0]['LineNum']
        User_Type[index].NextUser_mode = list[0]['Model']
        User_Type[index].NextUser_cirNum = list[0]['Circle']

    result = {'line': list, "cutline": list2, 'nowUserNam': User_Type[index].NowUser_name, 'nowUserNum': User_Type[index].NowUser_LineNum,
              'nowUserMode': User_Type[index].NowUser_mode, 'nowUserCirNum': User_Type[index].NowUser_cirNum, "startTime": User_Type[index].StartTime,
              'nextUserNam': User_Type[index].NextUser_name, 'nextUserNum': User_Type[index].NextUser_LineNum, 'nextUserMode': User_Type[index].NextUser_mode,
              'nextUserCirNum': User_Type[index].NextUser_cirNum}
    return Response(result)


@api_view(["POST"])
def register(request):
    name = request.data.get("name")
    RD = request.data.get("RD")
    model = request.data.get("model")
    circle = request.data.get("circle")
    chamber = request.data.get("chamber")
    # cutline = request.data.get("cutline")
    if request.data.get("cutline") is None:
        cutline = 0
    else:
        cutline = 1
    print(name, RD, model, circle, cutline, chamber)
    RD_BuType, extension_num = get_BuType(RD)
    sql1 = "SELECT COUNT(*) FROM {} WHERE DATE(startTime)= CURDATE()".format(chamber)
    with connection.cursor() as cursor:
        cursor.execute(sql1)
        num = cursor.fetchone()[0]+1

        sql2 = "INSERT INTO {} (BU_TYPE,RD_NAME,RD,MODEL,CIRCLE,LineNum,extension_num,cutline) VALUE ('{}','{}','{}','{}','{}','{}','{}','{}')".format(
            chamber, RD_BuType, name, RD, model, circle, num, extension_num, cutline)
        cursor.execute(sql2)
        connection.commit()

    return Response({"msg": "success"})


@api_view(["GET"])
def quit_line(request):
    LineNum = request.GET["LineNum"]
    chamber = request.GET["chamber"]
    # print(LineNum, chamber)

    sql = "SELECT * FROM {} WHERE  DATE(startTime)= CURDATE() AND (Done=false) AND (LineNum={})".format(
        chamber, LineNum)
    with connection.cursor() as cursor:
        cursor.execute(sql)
        list = dictfetchall(cursor)

        if list is not None:
            sql = "UPDATE {} SET Done=true WHERE id={}".format(
                chamber, list[0]['id'])

            cursor.execute(sql)
            connection.commit()

            channel_layer = get_channel_layer()
            async_to_sync(channel_layer.group_send)(chamber, {
                "type": "chat_message",
                "message": ["fileChange2", True],
            })

    return Response({"msg": "success"})


def get_BuType(id):

    sql = "SELECT EM_NAME,ID,BU_TYPE,extension_num FROM EMPLOYER WHERE RD={}".format(
        id)
    with connection.cursor() as cursor:
        cursor.execute(sql)
        # result = cursor.fetchone()
        result = dictfetchall(cursor)
    print(result)

    Bu_Type = result[0]["BU_TYPE"]
    extension_num = result[0]["extension_num"]
    return Bu_Type, extension_num


@api_view(["GET"])
def getAllBU(request):
    # startTime = "CURDATE"
    # # https://www.itread01.com/article/1524195344.html
    # https://www.fooish.com/sql/mysql-curdate-function.html
    chamber = request.GET["chamber"]
    sql = "SELECT * FROM WNC.{} ;".format(chamber)

    with connection.cursor() as cursor:
        cursor.execute(sql)
        list = dictfetchall(cursor)

    group = {"CATR": "00:00:00", "SAS": "00:00:00", "AIS": "00:00:00",
             "CH": "00:00:00", "NW": "00:00:00", "Other": "00:00:00"}
    for i in list:
        timeInterval = time_minus(str(i["endTime"]).split(
            " ")[1], str(i["startTime"]).split(" ")[1])
        if i["BU_Type"] == "SAS_JER500":
            group["SAS"] = time_add(timeInterval, group["SAS"])
        elif i["BU_Type"] == "CH1_H60000" or i["BU_Type"] == "CH2_H50000" or i["BU_Type"] == "CH3_H70000":
            group["CH"] = time_add(timeInterval, group["CH"])
        elif i["BU_Type"] == "NW1_D10000" or i["BU_Type"] == "NW2_D20000" or i["BU_Type"] == "NW3_D30000":
            group["NW"] = time_add(timeInterval, group["NW"])
        elif i["BU_Type"] == "AIC_T50000" or i["BU_Type"] == "ICS_T30000" or i["BU_Type"] == "SMA_T20000":
            group["AIS"] = time_add(timeInterval, group["AIS"])
        else:
            group["Other"] = time_add(timeInterval, group["Other"])

    return JsonResponse(group, safe=False)


def dictfetchall(cursor):
    columns = [col[0] for col in cursor.description]

    return [
        dict(zip(columns, row))
        for row in cursor.fetchall()
    ]


def time_split(t):
    t = str(t).split(":")

    if len(t) == 2:
        t_h = t[0]
        t_m = t[0]
        t_s = t[1]
    elif len(t) == 3:
        t_h = t[0]
        t_m = t[1]
        t_s = t[2]

    return t_h, t_m, t_s


def time_add(t1, t2):
    t1_h = time_split(t1)[0]
    t1_m = time_split(t1)[1]
    t1_s = time_split(t1)[2]
    t2_h = time_split(t2)[0]
    t2_m = time_split(t2)[1]
    t2_s = time_split(t2)[2]
    t_temp = 0

    t_s = int(t1_s)+int(t2_s)
    while t_s >= 60:
        t_s -= 60
        t_temp += 1

    t_m = int(t1_m)+int(t2_m)+t_temp
    t_temp = 0
    while t_m >= 60:
        t_m -= 60
        t_temp += 1

    t_h = int(t1_h)+int(t2_h)+t_temp
    t_total = str(t_h).zfill(2) + ":" + \
        str(t_m).zfill(2) + ":" + str(t_s).zfill(2)
    return t_total


def time_minus(t1, t2):
    t1_h = time_split(t1)[0]
    t1_m = time_split(t1)[1]
    t1_s = time_split(t1)[2]
    t2_h = time_split(t2)[0]
    t2_m = time_split(t2)[1]
    t2_s = time_split(t2)[2]
    t_temp = 0

    t_s = int(t1_s)-int(t2_s)
    while t_s >= 60:
        t_s -= 60
        t_temp += 1

    t_m = int(t1_m)-int(t2_m)+t_temp
    t_temp = 0
    while t_m >= 60:
        t_m -= 60
        t_temp += 1

    t_h = int(t1_h)-int(t2_h)+t_temp
    t_total = str(t_h).zfill(2) + ":" + \
        str(t_m).zfill(2) + ":" + str(t_s).zfill(2)
    return t_total
#########################################################################################


class Chamber_TYPE():
    def __init__(self):
        self.NowUser_id = 0
        self.NowUser_name = "None"
        self.NowUser_EmployeeID = 0
        self.NowUser_LineNum = 0
        self.NowUser_mode = "None"
        self.NowUser_cirNum = 0
        self.StartTime = "NA:NA:NA"

        self.NextUser_name = "None"
        self.NextUser_EmployeeID = 0
        self.NextUser_LineNum = 0
        self.NextUser_mode = "None"
        self.NextUser_cirNum = 0

#########################################################################################


class ThreadTCPserver(socketserver.ThreadingMixIn, socketserver.TCPServer):
    allow_reuse_address = True
    pass


class Handler_TCPServer(socketserver.BaseRequestHandler):

    cur_thread = threading.current_thread()
    print(f"Thread Handle: {cur_thread}")

    def handle(self):
        try:
            print(self.client_address)
            while True:
                if self.client_address != "0.0.0.0":
                    pass
                msg = self.request.recv(1024).decode("utf-8")
                print(f"client rev data:{msg}")
                if msg is None:
                    break
                elif msg.split("_", 1)[0] == "login":  # login_SG24_0200004630
                    self.login_RD(msg.split("_", 1)[1])
                elif msg.split("_", 1)[0] == "logout":
                    self.logout_RD(msg.split("_", 1)[1])
                else:
                    pass
                send_msg = "server received you message."
                send_back = self.request.sendall(send_msg.encode("utf-8"))
        except Exception as e:
            print("Error {}: {}".format(self.client_address[0], e))
        print("Client Disconnet ")

    def login_RD(self, data):
        chamber = data.split('_', 1)[0]  # SG24
        RD = data.split('_', 1)[1]  # 0200004630
        downTime = datetime.datetime.now().replace(microsecond=0)
        sql = "SELECT * FROM {} WHERE (RD={}) AND DATE(startTime)= CURDATE() AND Done=false".format(
            chamber, RD)

        if chamber == "SG24":
            index = 0
        elif chamber == "SG64":
            index = 1
        elif chamber == "CATR":
            index = 2

        with connection.cursor() as cursor:
            cursor.execute(sql)
            list = dictfetchall(cursor)

            if list is not None:
                if list[0]['cutline'] == 0:
                    sql = "UPDATE {} SET Done=true,startTime=CURRENT_TIMESTAMP,endTime=CURRENT_TIMESTAMP WHERE id={}".format(
                        chamber, list[0]['id'])
                    cursor.execute(sql)
                    connection.commit()

                User_Type[index].NowUser_id = list[0]['id']
                User_Type[index].NowUser_name = list[0]['RD_name']
                User_Type[index].NowUser_LineNum = list[0]['LineNum']
                User_Type[index].NowUser_EmployeeID = list[0]['RD']
                User_Type[index].NowUser_mode = list[0]['Model']
                User_Type[index].NowUser_cirNum = list[0]['Circle']
                User_Type[index].StartTime = str(downTime).split(" ")[1]
            else:
                print("Can not find your reservation")
                User_Type[index].NowUser_name = "No Booking..."
                User_Type[index].NowUser_LineNum = "No Booking..."
                User_Type[index].NowUser_EmployeeID = 0
                User_Type[index].StartTime = "NA:NA:NA"

        channel_layer = get_channel_layer()
        async_to_sync(channel_layer.group_send)(chamber, {
            "type": "chat_message",
            "message": ["fileChange2", True],
        })

    def logout_RD(self, data):
        chamber = data.split('_', 1)[0]  # SG24
        RD = data.split('_', 1)[1]  # 0200004630

        if chamber == "SG24":
            index = 0
        elif chamber == "SG64":
            index = 1
        elif chamber == "CATR":
            index = 2

        sql = "UPDATE {} SET endTime=CURRENT_TIMESTAMP WHERE id={}".format(
            chamber, User_Type[index].NowUser_id)

        with connection.cursor() as cursor:
            cursor.execute(sql)
            connection.commit()

        User_Type[index].NowUser_id = 0
        User_Type[index].NowUser_name = "None"
        User_Type[index].NowUser_LineNum = 0
        User_Type[index].NowUser_EmployeeID = 0
        User_Type[index].NowUser_mode = "None"
        User_Type[index].NowUser_cirNum = 0
        User_Type[index].StartTime = "NA:NA:NA"

        channel_layer = get_channel_layer()
        async_to_sync(channel_layer.group_send)(chamber, {
            "type": "chat_message",
            "message": ["fileChange2", True],
        })


def MyTCP():
    tcp_server = ThreadTCPserver(("127.0.0.1", 8001), Handler_TCPServer)
    tcp_server.serve_forever()


SG24 = Chamber_TYPE()
SG64 = Chamber_TYPE()
CATR = Chamber_TYPE()
User_Type = [SG24, SG64, CATR]
CardReader = threading.Thread(target=MyTCP)
CardReader.start()
