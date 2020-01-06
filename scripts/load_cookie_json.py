import os
import pickle5 as pickle
import json


def save_appstate(session_cookies):
    with open('appstate.bin', 'wb') as f:
        pickle.dump(session_cookies, f)


def get_appstate():
    try:
        with open('appstate.bin', 'rb') as fp:
            return pickle.load(fp)
    except:
        return None


def run():
    fp_json = open('cookie.json')
    cookie = json.load(fp_json)
    fp_json.close()

    fp_appstate = open('appstate.bin', 'rb')
    appstate = pickle.load(fp_appstate)
    fp_appstate.close()

    for i in appstate:
        print(i)
        for j in cookie:
            if j['name'] == i:
                print(appstate[i].value, "to", j['value'])
                appstate[i].set(i, j['value'], j['value'])

    f = open('appstate.bin', 'wb')
    pickle.dump(appstate, f)
    f.close()
