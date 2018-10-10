
RandomGenerator = {}

local q1 = 8039
local a1 = 113
local K = 4*q1 + 1
local C = 2*a1 + 1
local M = 2^16
local function random(lastseed)
    local seed = lastseed % M
    seed = K*seed + C
    seed = seed % M
    return seed / M, seed
end

--[[
    @desc ����������ӡ�
]]
function RandomGenerator:randomseed(seed)
    if seed==nil then
        -- seed = os.time()
        seed = tonumber(tostring(os.time()):reverse():sub(1, 6))
    end
    self._seed = seed
end

function RandomGenerator:getRandomseed()
    return self._seed
end

function RandomGenerator:rand()
    local r = 0
    r, self._seed = random(self._seed)
    return r
end

--[[
    @desc ����һ���ض���Χ�ڵİ�ƽ���ֲ��������
    @param n, m ָ���������Χ��
        ���n,m��Ϊnil���򷵻�0~1�ĸ����������
        �����mΪnil���򷵻�1~n�����������
        ���n,m����Ϊnil���򷵻�n~m�����������
]]
function RandomGenerator:random(n, m)
    if n==nil then
        return self:rand()
    elseif m==nil then
        return math.floor(self:rand()*n) + 1
    else
        return math.floor(self:rand()*(m+1-n)) + n
    end
end

--[[
    @desc �����ض��ֲ�����һ����ɢ�������
    @param distribution ��ɢ���ʷֲ��������������ʾ�����i��Ԫ�ص�ֵ
        P[i] = P(X in {X1,X2,...Xi})
        ����Xi�ĸ���
        P(X=Xi) = P[i]-P[i-1]
    @return ����������������±�
]]
function RandomGenerator:discreteRandom(distribution)
    assert(distribution~=nil)
    local r = self:rand()
    local i = 1
    local n = #distribution
    while i<=n do
        local prob = distribution[i]
        if prob==nil or r<=prob then
            return i
        end
        i = i+1
    end
    return i
end
RandomGenerator:randomseed(os.time())
print(RandomGenerator:random())