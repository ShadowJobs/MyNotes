require "a"
print("a======="..tostring(_G.a.yyy))
local c1={}
local meta={--__index=function(a,b,c)  end,
__newindex=function(a,b,c) print("aaaaaaaaaaaaa",a,b,c) rawset(a,b,2) end}

setmetatable(c1,meta)
print(c1["a"])
c1.c=1
print(c1.c)
meta.__newindex=nil
c1.c=1
print(c1.c)