import os
import re
import csv

folder = './DataSets'
merged = './raw_comments.csv'

os.chdir(folder)
fileList = os.listdir('.')

emoji_pattern = re.compile("["
                           u"\U0001F600-\U0001F64F"  # emoticons
                           u"\U0001F300-\U0001F5FF"  # symbols & pictographs
                           u"\U0001F680-\U0001F6FF"  # transport & map symbols
                           u"\U0001F1E0-\U0001F1FF"  # flags (iOS)
                           "]+", flags=re.UNICODE)

with open(merged, 'w', encoding='utf-8', newline='') as dest:
    writer = csv.writer(dest)
    for file in fileList:
        with open(file, 'r', encoding='utf-8') as f:
            reader = csv.reader(f)
            next(reader)
            for line in reader:
                if 2 > len(line):
                    continue

                line[1] = emoji_pattern.sub(r'', line[1])  # no emoji
                sLine = re.split('[!.?]', line[1].replace('\n', ''))
                for wLine in sLine:
                    if wLine == '':
                        continue
                    wLine = wLine.strip()
                    writer.writerow([wLine])
