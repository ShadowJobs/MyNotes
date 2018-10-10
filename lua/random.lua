
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
    @desc 设置随机种子。
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
    @desc 产生一个特定范围内的按平均分布随机数。
    @param n, m 指定随机数范围。
        如果n,m都为nil，则返回0~1的浮点随机数；
        如果仅m为nil，则返回1~n的随机整数；
        如果n,m都不为nil，则返回n~m的随机整数。
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
    @desc 根据特定分布产生一个离散随机变量
    @param distribution 离散概率分布函数，用数组表示，其第i个元素的值
        P[i] = P(X in {X1,X2,...Xi})
        返回Xi的概率
        P(X=Xi) = P[i]-P[i-1]
    @return 产生的随机变量的下标
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