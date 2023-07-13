import csv
import random

# Function to read the main CSV file
def read_main_data():
    main_data = []
    with open('main_data.csv', 'r') as csvfile:
        reader = csv.DictReader(csvfile)
        for row in reader:
            main_data.append(row)
    return main_data

# Function to split data into train and test sets
def split_data():
    main_data = read_main_data()

    # Shuffle the data randomly
    random.shuffle(main_data)

    # Calculate the number of rows for the train set
    train_size = int(len(main_data) * 0.9)

    # Split the data into train and test sets
    train_data = main_data[:train_size]
    test_data = main_data[train_size:]

    return train_data, test_data

# Function to save data to CSV file
def save_data_to_csv(data, filename):
    with open(filename, 'w', newline='') as csvfile:
        fieldnames = list(data[0].keys())
        writer = csv.DictWriter(csvfile, fieldnames=fieldnames)
        writer.writeheader()
        writer.writerows(data)

# Split the data into train and test sets
train_data, test_data = split_data()

# Save train and test data to CSV files
save_data_to_csv(train_data, 'train.csv')
save_data_to_csv(test_data, 'test.csv')

print('Data split and saved successfully!')
