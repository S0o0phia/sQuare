import os
import re
import csv
import random

folder = './DataSets'
train = 'trainSet.csv'
test = 'testSet.csv'

def getRawStrings(train, test):
    empty = ''
    fileList = os.listdir('.')
    charSet = re.compile('[^ 가-힣!.?:0-9]+')

    with open(train, 'w', encoding='utf-8', newline='') as train:
        with open(test, 'w', encoding='utf-8', newline='') as test:
            inputRows = []
            trainData = []
            testData = []
            trainWriter = csv.writer(train)
            testWriter = csv.writer(test)

            for file in fileList:
                with open(file, 'r', encoding='utf-8') as f:
                    reader = csv.reader(f)
                    try:
                        next(reader)
                    except StopIteration:
                        continue
                    for line in reader:
                        if 2 > len(line):
                            continue
                        line[1] = charSet.sub('', line[1])
                        line[1] = re.sub('\s+', ' ', line[1])
                        line[1] = re.sub('[0-9]+:[0-9]+', ' ', line[1]) #유튜브 타임라인  표시
                        line[1] = re.sub('[0-9]+분[0-9]+초', ' ', line[1]) #유튜브 타임라인  표시
                        tLine = re.split('[!.?]', line[1].replace('\n', ''))
                        sLine = [x for x in tLine if x]
                        for getLine in sLine:
                            getLine = getLine.strip()
                            if getLine.count(' ') > 2:
                                inputRows.append(getLine)
                            
            for (i, wLine) in enumerate(inputRows):     #와 소스 진짜 더럽다 ㅋㅋ
                if i % 2 == 0:
                    trainData.append(wLine)
                else:
                    testData.append(wLine)

            trainData = random.sample(trainData, 20000)
            testData = random.sample(testData, 5000)

            for element in trainData:
              trainWriter.writerow([element])

            for element in testData:
              testWriter.writerow([element])

os.chdir(folder)
getRawStrings(train, test)
