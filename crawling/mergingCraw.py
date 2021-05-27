import os
import csv

folder = './DataSets'
merged = './raw_comments.csv'

os.chdir(folder)
fileList = os.listdir('.')

with open(merged, 'w', encoding='utf-8', newline='') as dest:
    writer = csv.writer(dest)
    for file in fileList:
        with open(file, 'r', encoding='utf-8') as f:
            reader = csv.reader(f)
            next(reader)
            for line in reader:
                if 2 > len(line):
                    continue
                writer.writerow([line[1].replace('\n', '')])
