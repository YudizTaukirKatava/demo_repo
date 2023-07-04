l = []
size = int(input("Enter elements you wants to add in list: \n"))
for i in range(0,size):
    l.append(int(input()))

print(l)

target = float(input("Enter ytour target variabl here: "))
for i in range(0,size):
    for j in range(0,size):
        if l[i] + l[j] == target:
            print(l[i])
            print(" ",l[j])
            print("\n")


