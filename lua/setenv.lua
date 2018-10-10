function a()
	newfenv = {a=_G}
	setfenv(1, newfenv)
	a.print(1)    
end

function b()
	print(1)
end

a()
local meta={}
setfenv(b,meta)
local x=setmetatable(meta,{__index=_G})
b()