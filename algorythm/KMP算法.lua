local s1='BBC ABCDAB ABCDABCDABDE'
local s2='ABCDABD'
function getNext(str)
	local next={0}
	local len=string.len(str)
	local i=1
	local j=2
	local num=0
	while i<=len and j<=len do
		if string.sub(str,i,i)==string.sub(str,j,j) then 
			num=num+1
			next[j]=num
			i=i+1
			j=j+1
		else
			next[j]=0
			i=1
			j=j+1
		end 
	end
	return next
end
function kmp(str1,str2)
	local next=getNext(str2)
	local s1len=string.len(str1) 
	local s2len=string.len(str2)
	local i2=1
	for i1=1,s1len do 
		while string.sub(str2,i2,i2)~=string.sub(str1,i1,i1) and i2>1 do 
			i2=next[i2-1]+1
		end 
		if string.sub(str2,i2,i2)==string.sub(str1,i1,i1) then 
			i2=i2+1
		end
		if i2==s2len+1 then 
			return i1-s2len+1
		end
	end
end

function printT(t)
	for k,v in ipairs(t) do print(k,v ) end 
end
printT(getNext(s2))

print(kmp(s1,s2))

os.exit()