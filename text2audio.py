from gtts import gTTS
import os
mytext = 'Hi There, how are you? We have been waiting for you here since a very long time.'
language = 'en'
myobj = gTTS(text=mytext,lang=language, slow=False)
myobj.save("welcome.mp3")
os.system("welcome.mp3")