l = []
size = int(input("Enter how many numbers you wants to add in array: \n"))
for i in range(0,size):
    l.append(input())

print("Your list is:",l)

target = input("eNTER TARGET VARIABLE HERE: \n")

l.sort()
for i in range(0,size):
    if l[i]==target:
        print(" ",i)

